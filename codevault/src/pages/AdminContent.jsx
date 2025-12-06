import React, { useRef, useState } from "react"; 

export default function AdminContent() {
    // State and Ref for File Upload
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // State for Sorting
    const [sortKey, setSortKey] = useState('date_desc'); 
    
    // State for Filtering by Status
    const [activeFilter, setActiveFilter] = useState('All'); 

    // Sorting options
    const sortOptions = [
        { label: 'Date (Newest)', value: 'date_desc' },
        { label: 'Date (Oldest)', value: 'date_asc' },
        { label: 'Title (A-Z)', value: 'title_asc' },
    ];
    
    // Filtering options
    const filterOptions = [
        { label: 'All Statuses', value: 'All' },
        { label: 'Pending Review', value: 'pending' },
        { label: 'Approved', value: 'approved' },
    ];

    const rawContent = [
        { id: 1, title: "Project Documentation", author: "Chloe Magpale", type: "Document", status: "approved", date: "2024-12-01", folder: "Java", location: "/Projects/Documentation" },
        { id: 2, title: "Code Repository", author: "Paula Ng", type: "Repository", status: "pending", date: "2024-12-03", folder: "Python", location: "/Dev/SourceCode" },
        { id: 3, title: "Design Assets", author: "Chloe Paula", type: "Assets", status: "approved", date: "2024-12-05", folder: "System", location: "/Design/Marketing" },
        { id: 4, title: "API Documentation", author: "John Doe", type: "Document", status: "pending", date: "2024-12-06", folder: "HTML", location: "/Docs/API/v1" }
    ];
    
    // Filtering
    const filteredContent = rawContent.filter(item => {
        if (activeFilter === 'All') return true;
        return item.status === activeFilter;
    });

    // Sorting
    const sortedContent = [...filteredContent].sort((a, b) => {
        const [key, order] = sortKey.split('_');

        if (key === 'title') { 
            const comparison = a[key].localeCompare(b[key]);
            return order === 'asc' ? comparison : -comparison;
        }

        if (key === 'date') {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            const comparison = dateA.getTime() - dateB.getTime(); 
            return order === 'asc' ? comparison : -comparison;
        }
        
        return 0;
    });

    // Approve handler
    const handleApprove = (contentId) => {
        alert(`Content ${contentId} approved`);
    };

    // Reject handler
    const handleReject = (contentId) => {
        if (window.confirm("Are you sure you want to reject this content?")) {
            alert(`Content ${contentId} rejected`);
        }
    };

    // File Upload Handlers
    const handleFileUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            alert(`File selected: ${file.name}. Ready for upload!`);
        }
    };
    
    const handleSortChange = (event) => {
        setSortKey(event.target.value);
    };

    const handleFilterChange = (event) => {
        setActiveFilter(event.target.value);
    };

    return (
        <>
            <section className="hero">
                <h2 className="hero-title">Content Management</h2>
                <p className="hero-sub">Review, approve, and manage all platform content and uploads.</p>
            </section>

            {/* Upload Button */}
            <div className="upload-section" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <button 
                    className="action-btn btn-primary"
                    onClick={handleFileUploadClick}
                >
                    + Upload New File
                </button>
            </div>

            <div className="panel">
                <div className="panel-header" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <h3 className="panel-title">Content Library</h3>

                        {/* Filter Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Filter:</span>
                            <select
                                value={activeFilter}
                                onChange={handleFilterChange}
                                className="action-btn btn-primary"
                                style={{ 
                                    appearance: 'none', 
                                    padding: '8px 24px 8px 12px',
                                    background: 'rgba(102, 126, 234, 0.3) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a8b3ff\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 10px center',
                                    backgroundSize: '12px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    minWidth: '150px'
                                }}
                            >
                                {filterOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Sort:</span>
                            <select
                                value={sortKey}
                                onChange={handleSortChange}
                                className="action-btn btn-primary"
                                style={{ 
                                    appearance: 'none', 
                                    padding: '8px 24px 8px 12px',
                                    background: 'rgba(102, 126, 234, 0.3) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a8b3ff\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 10px center',
                                    backgroundSize: '12px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    minWidth: '160px'
                                }}
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="table-responsive-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Type</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sortedContent.map(item => (
                                <tr key={item.id}>
                                    <td>#{item.id}</td>
                                    <td>{item.title}</td>
                                    <td>{item.author}</td>
                                    <td>{item.type}</td>
                                    <td>
                                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                                            {item.location}
                                        </span>
                                    </td>

                                    <td>
                                        <span className={`status-badge ${item.status}`}>
                                            {item.status}
                                        </span>
                                    </td>

                                    <td>{item.date}</td>

                                    <td>
                                        {item.status === "pending" && (
                                            <>
                                                <button 
                                                    className="action-btn btn-success"
                                                    onClick={() => handleApprove(item.id)}
                                                >
                                                    Approve
                                                </button>

                                                <button 
                                                    className="action-btn btn-danger"
                                                    onClick={() => handleReject(item.id)}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}

                                        {item.status === "approved" && (
                                            <button className="action-btn btn-primary">View</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    );
}
