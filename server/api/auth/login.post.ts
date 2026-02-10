import { verify } from "argon2";
import { prisma } from "../../utils/db";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validate input
    const { email, password } = loginSchema.parse(body);

    // --- [CEREBRO INTELLIGENCE] HYBRID HANDSHAKE ---
    // Fetch user and system role metadata via high-speed query
    const users: any[] = await prisma.$queryRaw`
      SELECT u.*, r.name as "roleName", r.code as "roleCode", r.category as "roleCategory"
      FROM "User" u
      JOIN "SystemRole" r ON u."roleId" = r.id
      WHERE u.email = ${email}
      LIMIT 1
    `;

    const user = users[0];

    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Invalid email or password",
      });
    }

    // Check account status
    if (user.status !== "ACTIVE") {
      throw createError({
        statusCode: 403,
        message: `Your account is ${user.status
          .toLowerCase()
          .replace("_", " ")}.`,
      });
    }

    // Verify password
    const isValidPassword = await verify(user.password, password);
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: "Invalid email or password",
      });
    }

    // --- NEURAL PERMISSION HARVESTING (Raw SQL) ---
    // This query pulls from both Direct Role-Permissions and Neural Cluster-Permissions
    const permissions: any[] = await prisma.$queryRaw`
      SELECT DISTINCT p.code
      FROM "Permission" p
      LEFT JOIN "RolePermission" rp ON rp."permissionId" = p.id
      LEFT JOIN "GroupPermission" gp ON gp."permissionId" = p.id
      LEFT JOIN "RolePermissionGroup" rpg ON rpg."groupId" = gp."groupId"
      WHERE rp."roleId" = ${user.roleId} 
         OR rpg."roleId" = ${user.roleId}
    `;

    const unifiedPermissions = permissions.map((p) => p.code);

    // Track login history
    const ip =
      getHeader(event, "x-forwarded-for") ||
      event.node.req.socket.remoteAddress;
    const userAgent = getHeader(event, "user-agent");

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      }),
      prisma.loginLog.create({
        data: {
          userId: user.id,
          ip: typeof ip === "string" ? ip : null,
          userAgent,
          metadata: {
            method: "credentials",
            loginAt: new Date().toISOString(),
          },
        },
      }),
    ]);

    // Fetch Profile based on role category
    let profileData = null;
    if (user.roleCategory === "SYSTEM") {
      profileData = await prisma.staffProfile.findUnique({
        where: { userId: user.id },
      });
    } else if (user.roleCategory === "AGENT") {
      profileData = await prisma.agentProfile.findUnique({
        where: { userId: user.id },
      });
    } else {
      profileData = await prisma.applicantProfile.findUnique({
        where: { userId: user.id },
      });
    }

    // Assemble dynamic identity object
    const userData = {
      id: user.id,
      email: user.email,
      roleName: user.roleName,
      roleCode: user.roleCode,
      roleCategory: user.roleCategory,
      permissions: unifiedPermissions,
      status: user.status,
      profile: profileData,
    };

    // Set high-authority encrypted session
    await setUserSession(event, {
      user: userData,
      loggedInAt: Date.now(),
    });

    return {
      success: true,
      user: userData,
    };
  } catch (error: any) {
    if (error.issues) {
      throw createError({
        statusCode: 400,
        message: "Invalid input data",
        data: error.issues,
      });
    }
    throw error;
  }
});
