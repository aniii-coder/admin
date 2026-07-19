import React from 'react';
import styles from './CustomDataTable.module.css';

export default function CustomDataTable({ config, data, emptyMessage = "No data available" }) {
  console.log("config, data :>> ", config, data);
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {config.map((column, index) => {
              const headerAlignClass =
                styles[`align-${column.align || "left"}`];
              return (
                <th
                  key={column.key || index}
                  className={`${styles.th} ${headerAlignClass}`}
                  style={{ width: column.width || "auto" }}
                >
                  {column.header}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className={styles.tr}>
                {config.map((column, colIndex) => {
                  const cellAlignClass =
                    styles[`align-${column.align || "left"}`];

                  return (
                    <td
                      key={column.key || colIndex}
                      className={`${styles.td} ${cellAlignClass}`}
                    >
                      {console.log("column :>> ", row, column)}
                      <div
                        onClick={
                          column.isLink
                            ? () => column.onClick?.(row)
                            : undefined
                        }
                        style={
                          column.isLink
                            ? {
                                cursor: "pointer",
                                color: "#2563eb",
                              }
                            : undefined
                        }
                      >
                        {column.render
                          ? column.render(row[column.key], row, rowIndex)
                          : row[column.key]}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={config.length} className={styles.emptyCell}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

