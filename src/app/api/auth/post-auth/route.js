import { WorkOS } from "@workos-inc/node";

const workos = new WorkOS(process.env.WORKOS_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { user } = body;

    if (!user || !user.id) {
      return Response.json({ error: "Invalid user data" }, { status: 400 });
    }

    const chatBootOrgId = process.env.WORKOS_DEFAULT_ORGANIZATION_ID;

    if (!chatBootOrgId) {
      return Response.json({ error: "Chat-Boot org ID not configured" }, { status: 500 });
    }

    // Check if user is already a member of the Chat-Boot organization
    const memberships = await workos.userManagement.listOrganizationMemberships({
      userId: user.id,
    });

    const alreadyInOrg = memberships.data.some(
      (membership) => membership.organizationId === chatBootOrgId
    );

    if (!alreadyInOrg) {
      await workos.userManagement.createOrganizationMembership({
        userId: user.id,
        organizationId: chatBootOrgId,
        roleSlug: "admin", // or "member" if you want limited access
      });

      console.log(`✅ User ${user.email} added to Chat-Boot org`);
    } else {
      console.log(`ℹ️ User ${user.email} already in Chat-Boot org`);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("❌ Post-auth hook error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
