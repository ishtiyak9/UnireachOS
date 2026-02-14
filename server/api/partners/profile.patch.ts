import { prisma } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session?.user || (session.user as any).roleCategory !== "AGENT") {
    throw createError({
      statusCode: 403,
      message: "Neural Access Denied.",
    });
  }

  const userId = session.user.id;
  const body = await readBody(event);

  // Tactical Validation would go here

  try {
    const updatedProfile = await prisma.agentProfile.update({
      where: { userId },
      data: {
        // Personal Details
        firstName: body.firstName,
        lastName: body.lastName,
        address: body.address,
        country: body.country,
        primaryEmail: body.primaryEmail,
        primaryPhone: body.primaryPhone,

        // Company Details
        agencyName: body.agencyName,
        companyAddress: body.companyAddress,
        licenseNo: body.licenseNo,

        // Operational Settings
        showCommissionInSearch: body.showCommissionInSearch,
        sendCommissionNotifications: body.sendCommissionNotifications,
        showCommissionPaymentTab: body.showCommissionPaymentTab,

        // Bank Account Details
        beneficiaryName: body.beneficiaryName,
        bankAccountNumber: body.bankAccountNumber,
        bankName: body.bankName,
        bankBranch: body.bankBranch,
        bankLocation: body.bankLocation,
        bankCountry: body.bankCountry,
        bankState: body.bankState,
        bankCity: body.bankCity,
        bankSwiftCode: body.bankSwiftCode,
        bankIban: body.bankIban,

        phone: body.phone, // Legacy sync
      },
    });

    // SYNC: Registered email should be the primary email for partner case
    if (body.primaryEmail) {
      await prisma.user.update({
        where: { id: userId },
        data: { email: body.primaryEmail },
      });
    }

    return {
      success: true,
      message: "Strategic Profile Synchronized.",
      data: updatedProfile,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: "Failed to synchronize executive profile: " + error.message,
    });
  }
});
