import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { PageContainer } from '@/components/design-system'
import logoSrc from '@/assets/Logo.svg'

interface AccessCardProps {
  title: string
  subtitle: string
  children: React.ReactNode
  secondaryLabel: string
  secondaryTo: string
  secondaryDescription: string
  secondaryIcon: React.ReactNode
}

export function AccessCard({
  title,
  subtitle,
  children,
  secondaryLabel,
  secondaryDescription,
  secondaryTo,
  secondaryIcon,
}: AccessCardProps) {
  return (
    <PageContainer
      maxWidth="sm"
      className="min-h-screen flex flex-col items-center justify-center py-12"
    >
      <img
        src={logoSrc}
        alt="FINANCY"
        className="h-8 w-auto mb-8"
      />
      <Card className="w-full max-w-[448px]">
        <CardHeader className="flex flex-col items-center text-center">

          <h2 className="text-xl font-semibold leading-none tracking-tight">{title}</h2>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        {children}
        <CardContent className="pt-0 flex flex-col gap-4">
          <div className="relative flex items-center gap-2">
            <div className="flex-1 border-t border-border" />
            <span className="text-sm text-muted-foreground">ou</span>
            <div className="flex-1 border-t border-border" />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            {secondaryDescription}
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link to={secondaryTo}>
              {secondaryIcon}
              {secondaryLabel}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
