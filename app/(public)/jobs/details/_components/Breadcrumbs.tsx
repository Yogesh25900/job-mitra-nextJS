import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="mb-6 flex items-center text-sm text-slate-500 dark:text-slate-400">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-slate-900 dark:text-white">{item.label}</span>
          )}
          {index < items.length - 1 && <span className="mx-2">/</span>}
        </div>
      ))}
    </nav>
  )
}