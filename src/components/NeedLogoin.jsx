import { withAuth } from "@workos-inc/authkit-nextjs";
import { WorkOS } from "@workos-inc/node";
import ChatBoot from "./Chat";

async function NeedLogoin() {
  const workos = new WorkOS(process.env.WORKOS_API_KEY || "");
  const { user } = await withAuth();

  if (!user) {
    return (
      <div className="container mx-auto flex justify-center items-center mt-32 my-4">
        <div className="font-bold text-xl font-sans animate-bounce">
          You need to be logged in to use Chat.
        </div>
      </div>
    );
  }

  const chatBootOrgId = process.env.WORKOS_DEFAULT_ORGANIZATION_ID;

  // Fetch existing memberships
  const memberships = await workos.userManagement.listOrganizationMemberships({
    userId: user.id,
  });

  const isInChatBoot = memberships.data.some(
    (membership) => membership.organizationId === chatBootOrgId
  );

  // If not in Chat-Boot, add user
  if (!isInChatBoot && chatBootOrgId) {
    await workos.userManagement.createOrganizationMembership({
      userId: user.id,
      organizationId: chatBootOrgId,
      roleSlug: "admin",
    });
  }

  // Get Chat-Boot organization info
  const chatBootOrg = await workos.organizations.getOrganization(chatBootOrgId);

  return (
    <div>
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
      <ChatBoot />
    </div>
  );
}

export default NeedLogoin;

{
  /* <div className="border inline-block rounded-md">
        <Link
          href={"/new-listing/" + chatBootOrgId}
          className="py-2 px-4 flex gap-2 items-center"
        >
          {chatBootOrg.name}
        </Link>
      </div>

      <Link
        href={"/new-company"}
        className="px-4 py-2 rounded-md inline-flex mt-6 items-center gap-2"
      >
        Create a new company
      </Link> */
}
