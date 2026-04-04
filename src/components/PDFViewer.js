import React, { useState, useEffect } from 'react';

export default function PDFViewer({ materials }) {
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    if (materials && materials.length > 0 && !selectedMaterial) {
      setSelectedMaterial(materials[0]);
    }
  }, [materials]);

  console.log('Materials received:', materials);

  if (!materials || materials.length === 0) {
    return <div style={styles.empty}>No materials available</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.viewerSection}>
        {selectedMaterial ? (
          <>
            <h3 style={styles.materialTitle}>{selectedMaterial.title}</h3>
            <div style={styles.pdfWrapper}>
              <iframe
                src={selectedMaterial.file_url}
                title={selectedMaterial.title}
                style={styles.pdfFrame}
              />
            </div>
          </>
        ) : (
          <div style={styles.placeholder}>Select a material to view</div>
        )}
      </div>

      <div style={styles.listSection}>
        <h3>Course Materials ({materials.length})</h3>
        <div style={styles.materialList}>
          {materials.map(mat => (
            <div
              key={mat.id}
              onClick={() => setSelectedMaterial(mat)}
              style={selectedMaterial?.id === mat.id ? styles.listItemActive : styles.listItem}
            >
              <span>📄</span>
              <div>
                <div>{mat.title}</div>
                <small>Click to view</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', gap: '25px', flexWrap: 'wrap' },
  viewerSection: { flex: 2, minWidth: '400px', backgroundColor: 'white', borderRadius: '12px', padding: '20px' },
  pdfWrapper: { height: '600px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' },
  pdfFrame: { width: '100%', height: '100%', border: 'none' },
  materialTitle: { fontSize: '18px', marginBottom: '15px' },
  listSection: { flex: 1, minWidth: '280px', backgroundColor: 'white', borderRadius: '12px', padding: '20px' },
  materialList: { marginTop: '15px' },
  listItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '8px' },
  listItemActive: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#e0e7ff', marginBottom: '8px' },
  placeholder: { textAlign: 'center', padding: '80px', color: '#64748b' },
  empty: { textAlign: 'center', padding: '40px', color: '#64748b' },
};