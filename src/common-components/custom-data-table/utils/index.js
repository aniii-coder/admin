import React from 'react';
import { Edit2, Eye, Rocket, Trash2 } from 'lucide-react';
import Image from 'next/image';

export const usersData = [
  { id: 101, name: 'Alice Smith', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 102, name: 'Bob Jones', email: 'bob@example.com', role: 'Editor', status: 'Inactive' },
  { id: 103, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Subscriber', status: 'Active' },
];

export const actions = [
  { id: 1, key: "preview", icon: Eye, color: '#2563eb' },
  { id: 2, key: "edit", icon: Edit2, color: '#0f766e' },
  { id: 3, key: "delete", icon: Trash2, color: '#dc2626' },
  { id: 4, key: "live", icon: Rocket, color: '#16a34a' },
];
// import React from "react";
// import { Edit2, Eye, Rocket, Trash2 } from "lucide-react";

export const getTableConfig = (pathname, router) => [
  {
    key: "_id",
    header: "ID",
    width: "120px",
    align: "center",
    render: (value) => value.slice(-6),
  },
  {
    key: "name",
    header: "User Info",
    isLink: true,
    onClick: (row) => router.push(`${pathname}/${row._id}`),
    render: (value, row) => (
      <div style={{display:'flex', gap:'10px'}}>
        <Image src={row?.avatar} height={40} width={40} style={{borderRadius:'50%'}}/>
        <div style={{display:'flex', flexDirection: 'column'}}>
            <div style={{ fontWeight: 600 }}>{value}</div>
        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
          {row.email}
        </div>
        </div>
      </div>
    ),
  },
  {
  key: "lastLogin",
  header: "Joined Date",
  isLink: false,
//   onClick: (row) => router.push(`${pathname}/${row._id}`),
  render: (value, row) => (
    <div style={{ display: "flex", gap: "10px" }}>
      {/* <Image
        src={row.avatar}
        alt={row.name}
        width={40}
        height={40}
        style={{ borderRadius: "50%" }}
      /> */}

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontWeight: 600 }}>
          {new Date(value).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>

        {/* <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
          {row.email}
        </div> */}
      </div>
    </div>
  ),
},
  {
    key: "role",
    header: "Role",
    render: () => "Client",
  },
  {
    key: "isActive",
    header: "Status",
    render: (value) => (
      <span
        style={{
          padding: "4px 8px",
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          background: value ? "#dcfce7" : "#fee2e2",
          color: value ? "#166534" : "#991b1b",
        }}
      >
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
  // {
  //   key: "blogIds",
  //   header: "Blog Count",
  //   render: (value) => (
  //     <span
  //       style={{
  //         padding: "4px 8px",
  //         borderRadius: 6,
  //         fontSize: 12,
  //         fontWeight: 600,
  //       //   background: value ? "#dcfce7" : "#fee2e2",
  //       //   color: value ? "#166534" : "#991b1b",
  //       }}
  //     >
  //       {value?.length}
  //     </span>
  //   ),
  // },
//   {
//     key: "actions",
//     header: "Actions",
//     align: "right",
//     width: "170px",
//     render: (_, row) => {
//       const actions = [
//         {
//           icon: Eye,
//           color: "#2563eb",
//           onClick: () => router.push(`${pathname}/${row._id}`),
//         },
//         {
//           icon: Edit2,
//           color: "#0f766e",
//           onClick: () => router.push(`${pathname}/edit/${row._id}`),
//         },
//         {
//           icon: Trash2,
//           color: "#dc2626",
//           onClick: () => console.log("Delete", row),
//         },
//         {
//           icon: Rocket,
//           color: "#16a34a",
//           onClick: () => router.push(`/blog/${row._id}`),
//         },
//       ];

//       return (
//         <div
//           style={{
//             display: "flex",
//             gap: 10,
//             justifyContent: "flex-end",
//           }}
//         >
//           {actions.map(({ icon: Icon, color, onClick }, index) => (
//             <button
//               key={index}
//               onClick={onClick}
//               style={{
//                 border: "none",
//                 background: "transparent",
//                 cursor: "pointer",
//                 color,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Icon size={18} />
//             </button>
//           ))}
//         </div>
//       );
//     },
//   },
];