"use client"

import { useState } from "react"
import { Edit, Eye, MoreHorizontal, Plus, Trash, Calendar, CreditCard, Mail, Phone, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { getClients, deleteClient } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// Date formatting options for consistency between server and client
const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', DATE_FORMAT_OPTIONS)
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  join_date: string;
  status: string;
  total_bookings: number;
  active_bookings: number;
  completed_bookings: number;
  total_spent: number;
  last_booking_date: string | null;
}

interface ClientsListProps {
  initialClients: Client[];
}

export function ClientsList({ initialClients }: ClientsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [bookingsRange, setBookingsRange] = useState([0, 50])
  const [spentRange, setSpentRange] = useState([0, 10000])
  const { toast } = useToast()

  const refreshClients = async () => {
    setLoading(true)
    try {
      const data = await getClients()
      setClients(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh clients",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClient = async (id: number) => {
    setLoading(true);
    const result = await deleteClient(id);
    if (result.success) {
      setClients((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Client deleted", variant: "default" });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setLoading(false);
  };

  const filteredClients = clients.filter((client) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearch = 
      (client.name?.toLowerCase() || "").includes(lowerSearchTerm) ||
      (client.email?.toLowerCase() || "").includes(lowerSearchTerm) ||
      (client.phone && client.phone.includes(searchTerm))
    
    const matchesStatus = statusFilter === "all" || (client.status?.toLowerCase() || "") === (statusFilter?.toLowerCase() || "");
    const matchesBookings = client.total_bookings >= bookingsRange[0] && client.total_bookings <= bookingsRange[1]
    const matchesSpent = client.total_spent >= spentRange[0] && client.total_spent <= spentRange[1]

    return matchesSearch && matchesStatus && matchesBookings && matchesSpent
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Clients</CardTitle>
            <CardDescription>Manage your customer database</CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Client
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between py-4 gap-4">
          <div className="flex gap-2 flex-1">
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Clients</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Total Bookings</h3>
                  <Slider
                    value={bookingsRange}
                    onValueChange={setBookingsRange}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{bookingsRange[0]} bookings</span>
                    <span>{bookingsRange[1]} bookings</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Total Spent</h3>
                  <Slider
                    value={spentRange}
                    onValueChange={setSpentRange}
                    max={10000}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>${spentRange[0]}</span>
                    <span>${spentRange[1]}</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredClients.length === 0 ? (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              No clients found
            </div>
          ) : (
            filteredClients.map((client) => (
              <Card key={client.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <CardDescription>
                        Joined {formatDate(client.join_date)}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> View profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> Edit client
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteClient(client.id)}
                          aria-label="Delete client"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleDeleteClient(client.id); }}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete client
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      {client.email}
                    </div>
                    {client.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        {client.phone}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={client.status === "Active" ? "default" : "secondary"}>
                      {client.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {client.active_bookings} active • {client.completed_bookings} completed
                    </span>
                  </div>
                  <div className="pt-2 border-t flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {client.last_booking_date ? formatDate(client.last_booking_date) : 'No bookings'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">${client.total_spent.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
