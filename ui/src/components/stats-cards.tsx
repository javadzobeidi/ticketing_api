import { Card, CardContent } from "@/src/components/ui/card"


export function StatsCards({stats}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.name}
          className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-2 overflow-hidden"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  stat.changeType === "positive" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                }`}
              >
                {stat.change}
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{stat.name}</p>
              <p className="text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
