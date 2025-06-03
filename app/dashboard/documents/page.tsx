"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload, Download, Printer, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { jsPDF } from "jspdf"
import { toast } from "@/components/ui/use-toast"
import dynamic from 'next/dynamic'
import Image from 'next/image'

interface PDFViewerProps {
  url: string
}

const PDFViewer = dynamic<PDFViewerProps>(() => import('@/components/pdf-viewer').then(mod => mod.default), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  )
})

export default function DocumentsPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    phone: "",
    email: "",
    address: "",
    vehicle: "",
    startDate: "",
    endDate: "",
    price: "",
    notes: ""
  })

  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    const img = document.createElement('img')
    img.src = '/images/logo_trans.png'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const dataUrl = canvas.toDataURL('image/png')
      const imgElement = document.createElement('img')
      imgElement.src = dataUrl
      setLogoImage(imgElement)
    }
  }, [])

  const vehicles = [
    { id: "1", name: "Toyota Camry - ABC123" },
    { id: "2", name: "Honda Civic - XYZ789" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleVehicleChange = (value: string) => {
    setFormData({ ...formData, vehicle: value })
  }

  const handleGenerateContract = () => {
    try {
      // Create new PDF document with slightly larger margins
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      const contentWidth = pageWidth - (2 * margin)

      // Add decorative header line
      doc.setDrawColor(0, 71, 171) // Professional blue color
      doc.setLineWidth(0.5)
      doc.line(margin, 8, pageWidth - margin, 8)
      
      // Add company logo/header if available
      if (logoImage) {
        const logoWidth = 40
        const logoHeight = 40
        const logoX = (pageWidth - logoWidth) / 2
        
        const canvas = document.createElement('canvas')
        canvas.width = logoImage.width
        canvas.height = logoImage.height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(logoImage, 0, 0)
        const imgData = canvas.toDataURL('image/png').split(',')[1]
        doc.addImage(imgData, 'PNG', logoX, 15, logoWidth, logoHeight, undefined, 'FAST')
      }
      
      // Add company name and title with enhanced styling
      doc.setFontSize(24)
      doc.setTextColor(0, 71, 171) // Professional blue color
      doc.text("SAIFAUTO", pageWidth / 2, 70, { align: "center" })
      
      doc.setFontSize(16)
      doc.setTextColor(100, 100, 100) // Gray color for subtitle
      doc.text("Car Rental Agreement", pageWidth / 2, 80, { align: "center" })

      // Add decorative line under title
      doc.setDrawColor(200, 200, 200) // Light gray
      doc.setLineWidth(0.2)
      doc.line(margin + 40, 85, pageWidth - margin - 40, 85)

      // Contract number and date
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      const contractNumber = Math.floor(Math.random() * 900000) + 100000
      const currentDate = new Date().toLocaleDateString()
      doc.text(`Contract #: ${contractNumber}`, margin, 100)
      doc.text(`Date: ${currentDate}`, pageWidth - margin, 100, { align: "right" })

      // Customer Information section with better organization
      doc.setFontSize(14)
      doc.setTextColor(0, 71, 171)
      doc.text("Customer Information", margin, 120)
      
      // Add section background
      doc.setFillColor(247, 250, 255) // Light blue background
      doc.rect(margin, 125, contentWidth, 45, 'F')
      
      // Customer details in two columns
      doc.setFontSize(11)
      doc.setTextColor(60, 60, 60)
      const col1X = margin + 5
      const col2X = pageWidth / 2 + 10
      
      doc.text(`Full Name: ${formData.firstName} ${formData.lastName}`, col1X, 135)
      doc.text(`ID/Passport: ${formData.idNumber}`, col2X, 135)
      doc.text(`Phone: ${formData.phone}`, col1X, 145)
      doc.text(`Email: ${formData.email}`, col2X, 145)
      doc.text(`Address: ${formData.address}`, col1X, 155)

      // Rental Details section
      doc.setFontSize(14)
      doc.setTextColor(0, 71, 171)
      doc.text("Rental Details", margin, 185)
      
      // Add section background
      doc.setFillColor(247, 250, 255)
      doc.rect(margin, 190, contentWidth, 45, 'F')
      
      // Rental information in organized layout
      doc.setFontSize(11)
      doc.setTextColor(60, 60, 60)
      const selectedVehicle = vehicles.find(v => v.id === formData.vehicle)?.name || ""
      doc.text(`Vehicle: ${selectedVehicle}`, col1X, 200)
      doc.text(`Start Date: ${formData.startDate}`, col1X, 210)
      doc.text(`End Date: ${formData.endDate}`, col2X, 210)
      doc.text(`Total Price: ${formData.price} MAD`, col1X, 220)

      // Notes section if available
      if (formData.notes) {
        doc.setFontSize(14)
        doc.setTextColor(0, 71, 171)
        doc.text("Terms & Conditions", margin, 250)
        
        // Add section background
        doc.setFillColor(247, 250, 255)
        doc.rect(margin, 255, contentWidth, 30, 'F')
        
        doc.setFontSize(10)
        doc.setTextColor(60, 60, 60)
        const splitNotes = doc.splitTextToSize(formData.notes, contentWidth - 10)
        doc.text(splitNotes, margin + 5, 265)
      }

      // Signature section with lines and labels
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.2)
      
      // Customer signature
      doc.line(margin + 10, pageHeight - 40, margin + 80, pageHeight - 40)
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text("Customer Signature", margin + 10, pageHeight - 35)
      
      // Company signature
      doc.line(pageWidth - margin - 80, pageHeight - 40, pageWidth - margin - 10, pageHeight - 40)
      doc.text("Company Representative", pageWidth - margin - 80, pageHeight - 35)

      // Add footer with page number
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(`Page 1 of 1`, pageWidth / 2, pageHeight - 10, { align: "center" })
      
      // Generate PDF URL
      const pdfOutput = doc.output('datauristring')
      setPdfUrl(pdfOutput)

      toast({
        title: "Contract Generated",
        description: "Your contract has been generated successfully.",
      })
    } catch (error) {
      console.error('Error generating contract:', error)
      toast({
        title: "Error",
        description: "Failed to generate contract. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl)
      printWindow?.print()
    }
  }

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `rental-contract-${formData.firstName}-${formData.lastName}.pdf`
      link.click()
    }
  }

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      idNumber: "",
      phone: "",
      email: "",
      address: "",
      vehicle: "",
      startDate: "",
      endDate: "",
      price: "",
      notes: ""
    })
    setPdfUrl(null)
  }

  return (
    <DashboardShell>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-8">Rental Contract Generator</h1>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idNumber">CIN/Passport Number</Label>
                <Input
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle</Label>
                <Select name="vehicle" value={formData.vehicle} onValueChange={handleVehicleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Rental Price (MAD)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes / Terms</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handleGenerateContract}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Contract
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Reset Form
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Contract Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white border rounded-lg shadow-sm" style={{ height: '842px' }}>
                {pdfUrl ? (
                  <PDFViewer url={pdfUrl} />
                ) : (
                  <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                    Fill in the form and click "Generate Contract" to preview the document
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <Button variant="outline" onClick={handlePrint} disabled={!pdfUrl}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Contract
                </Button>
                <Button variant="outline" onClick={handleDownload} disabled={!pdfUrl}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
} 