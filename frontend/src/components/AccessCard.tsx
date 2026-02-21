import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
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
}

export function AccessCard({
  title,
  subtitle,
  children,
  secondaryLabel,
  secondaryTo,
}: AccessCardProps) {
  return (
    <PageContainer
      maxWidth="sm"
      className="min-h-screen flex flex-col items-center justify-center py-12"
    >
      <Card className="w-full max-w-[448px]">
        <CardHeader className="flex flex-col items-center text-center">
          <img
            src={logoSrc}
            alt="FINANCY"
            className="h-8 w-auto mb-4"
          />
          <h2 className="text-2xl font-semibold leading-none tracking-tight">{title}</h2>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        {children}
        <CardContent className="pt-0 flex flex-col gap-4">
          <div className="relative flex items-center gap-2">
            <div className="flex-1 border-t border-border" />
            <span className="text-sm text-muted-foreground">ou</span>
            <div className="flex-1 border-t border-border" />
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link to={secondaryTo}>
              {secondaryLabel}
              <ArrowRight className="size-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
