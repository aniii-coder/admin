import UserDetail from "@/features/user-list/components/user-view/UserDetail";

export default function index() {
    const mockUserData = {
  "_id": "6a5ba593f1d84340035984eb",
  "name": "Kritika Singh",
  "email": "kritikasingh270508@gmail.com",
  "avatar": "https://lh3.googleusercontent.com/a/ACg8ocJKyIA93UckXEMy3xJCSP5EzAupo8JI0KfHBZj37keEn9zRkA=s96-c",
  "isActive": true,
  "lastLogin": "2026-07-18T16:10:59.414Z",
  "loginProvider": "google",
  "emailVerified": true,
  "blogIds": [
    "6a5bb43cfcf388301902fde4",
    "6a5bb43cfcf388301902fde7",
    "6a5bb26cfcf388301902fde8"
  ],
  "likedBlogs": [],
  "commentedBlogs": [],
  "savedBlogs": [],
  "createdAt": "2026-07-18T16:10:59.415Z",
  "updatedAt": "2026-07-18T17:27:06.518Z"
};
    return(
        <UserDetail user={mockUserData}/>
    )
};
