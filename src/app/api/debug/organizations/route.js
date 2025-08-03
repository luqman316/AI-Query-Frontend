// import { WorkOS } from "@workos-inc/node";

// const workos = new WorkOS(process.env.WORKOS_API_KEY);
// export async function GET() {

//   try {
//     // Get all organizations
//     const organizations = await workos.organizations.listOrganizations();

//     return Response.json({
//       organizations: organizations.data.map((org) => ({
//         id: org.id,
//         name: org.name,
//         domains: org.domains,
//       })),
//     });
//   } catch (error) {
//     return Response.json({ error: error.message }, { status: 500 });
//   }
// }
