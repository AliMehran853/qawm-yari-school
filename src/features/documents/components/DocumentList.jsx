import DocumentCard from './DocumentCard'

export default function DocumentList({ documents, onEdit, onDelete, canManage = true }) {
  if (!documents || documents.length === 0) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          doc={doc}
          onEdit={onEdit}
          onDelete={onDelete}
          canManage={canManage}
        />
      ))}
    </div>
  )
}