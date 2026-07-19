import React from 'react';
import { Eye, Heart, MessageSquare, Edit2, Trash2 } from 'lucide-react';

export const getBlogTableConfig = (router) => [
  {
    key: 'thumbnail',
    header: 'Cover',
    width: '90px',
    align: 'center',
    render: (value, row) => (
      <img 
        src={value || 'https://via.placeholder.com/60x40'} 
        alt={row.title} 
        style={{ 
          width: '60px', 
          height: '40px', 
          borderRadius: '4px', 
          objectFit: 'cover',
          border: '1px solid #e2e8f0'
        }} 
      />
    )
  },
  {
    key: 'title',
    header: 'Blog Details',
    isLink: true, 
    onClick: (row) => {
      router.push(`/admin/blogs/${row.slug}`);
    },
    render: (value, row) => (
      <div style={{ maxWidth: '340px' }}>
        <div style={{ fontWeight: '600', color: '#0f172a', lineHeight: '1.4' }}>{value}</div>
        <div style={{ 
          fontSize: '0.8rem', 
          color: '#64748b', 
          textOverflow: 'ellipsis', 
          overflow: 'hidden', 
          whiteSpace: 'nowrap',
          marginTop: '2px' 
        }}>
          {row.description}
        </div>
      </div>
    )
  },
  {
    key: 'category',
    header: 'Category',
    width: '120px',
    render: (value) => (
      <span style={{
        fontSize: '0.8rem',
        background: '#f1f5f9',
        color: '#475569',
        padding: '4px 8px',
        borderRadius: '6px',
        fontWeight: '500'
      }}>
        {value}
      </span>
    )
  },
  {
    key: 'metrics',
    header: 'Engagement',
    width: '200px',
    render: (_, row) => (
      <div style={{ display: 'flex', gap: '14px', fontSize: '0.85rem', color: '#64748b' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Total Views">
          <Eye size={14} style={{ color: '#3b82f6' }} /> {row.views?.toLocaleString() || 0}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Total Likes">
          <Heart size={14} style={{ color: '#ef4444' }} /> {row.likes?.toLocaleString() || 0}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Comments">
          <MessageSquare size={14} style={{ color: '#10b981' }} /> {row.comments?.toLocaleString() || 0}
        </span>
      </div>
    )
  },
  {
    key: 'published',
    header: 'Status',
    width: '110px',
    align: 'center',
    render: (value) => {
      const isLive = !!value;
      return (
        <span style={{
          padding: '4px 10px',
          borderRadius: '9999px',
          fontSize: '0.78rem',
          fontWeight: '600',
          backgroundColor: isLive ? '#dcfce7' : '#fee2e2',
          color: isLive ? '#166534' : '#991b1b',
          textTransform: 'uppercase',
          letterSpacing: '0.025em'
        }}>
          {isLive ? 'Live' : 'Draft'}
        </span>
      );
    }
  },
  {
    key: 'actions',
    header: 'Actions',
    width: '100px',
    align: 'right',
    render: (_, row) => (
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button 
          onClick={(e) => {
            e.stopPropagation(); 
            router.push(`/admin/blogs/${row._id}/view`);
          }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '4px' }}
          title="View"
        >
          <Eye size={16} />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation(); 
            router.push(`/admin/blogs/edit/${row._id}`);
          }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '4px' }}
          title="Edit Entry"
        >
          <Edit2 size={16} />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if(confirm(`Are you sure you want to drop "${row.title}"?`)) {
              console.log("Delete target ID:", row._id);
            }
          }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '4px' }}
          title="Delete Entry"
        >
          <Trash2 size={16} />
        </button>
      </div>
    )
  }
];