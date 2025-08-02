interface DashboardTitleProps {
  title: string
  description?: string
}

export function DashboardTitle({ title, description }: DashboardTitleProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  )
}
