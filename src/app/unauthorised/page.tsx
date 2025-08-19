import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Shield, Lock } from "lucide-react"

export default function UnauthorisedPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-6 pb-8">
          <div className="mx-auto w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center relative">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <Lock className="w-3 h-3 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-slate-800">Access Denied</h1>
            <div className="space-y-2 text-slate-600">
              <p>Sorry, you do not have permission to view this page.</p>
              <p>Please log in with an appropriate account or contact your administrator.</p>
            </div>
          </div>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 px-8">Go Back Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}