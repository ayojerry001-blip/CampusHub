import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, MapPin, Users, TrendingUp } from "lucide-react"

export function StatsSection() {
  const stats = [
    {
      icon: CalendarDays,
      value: "500+",
      title: "Events Organized",
      description: "Successful campus events",
    },
    {
      icon: MapPin,
      value: "11",
      title: "Venues Available",
      description: "Across all colleges",
    },
    {
      icon: Users,
      value: "2,000+",
      title: "Active Users",
      description: "Students, staff, and faculty",
    },
    {
      icon: TrendingUp,
      value: "98%",
      title: "Success Rate",
      description: "Streamlined processes",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-white to-fountain-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          Trusted by the <span className="text-fountain-green-500">Fountain Community</span>
        </h2>
        <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
          Real numbers that showcase our impact on campus event management and community engagement.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-fountain-green-100 text-fountain-green-600 mx-auto">
                  <stat.icon className="h-6 w-6" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CardTitle className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</CardTitle>
                <p className="text-lg font-semibold text-gray-800 mb-1">{stat.title}</p>
                <p className="text-gray-600 text-sm">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
