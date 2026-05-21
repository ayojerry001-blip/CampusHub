import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Users, MapPin, Shield, Award } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: CalendarDays,
      title: "Smart Event Planning",
      description:
        "Streamlined event creation with intelligent scheduling and automated conflict detection across all university venues.",
    },
    {
      icon: Users,
      title: "Community Engagement",
      description:
        "Connect students, faculty, and staff through seamless event registration and participation tracking.",
    },
    {
      icon: MapPin,
      title: "Venue Management",
      description:
        "Comprehensive venue booking system with real-time availability and resource allocation optimization.",
    },
    {
      icon: Shield,
      title: "Secure Approvals",
      description:
        "Multi-level approval workflows ensuring proper authorization and maintaining institutional governance.",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center rounded-full bg-fountain-green-100 px-3 py-1 text-sm font-medium text-fountain-green-700 mb-6">
          <Award className="h-4 w-4 mr-2" />
          Powerful Features
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          Everything You Need for <span className="text-fountain-green-500">Campus Events</span>
        </h2>
        <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
          From students to administrators, our platform provides comprehensive tools for efficient event management
          across all university operations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-left shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-fountain-green-100 text-fountain-green-600">
                  <feature.icon className="h-6 w-6" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CardTitle className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</CardTitle>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
