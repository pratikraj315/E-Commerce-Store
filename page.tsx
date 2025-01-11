'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ShoppingCart, Plus, Minus } from 'lucide-react'

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

type CartItem = Product & { quantity: number };

export default function EcommerceSystem() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // In a real application, this would fetch products from your API
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    // This would be replaced with an actual API call
    const mockProducts: Product[] = [
      { _id: '1', name: 'Smartphone', description: 'Latest model smartphone', price: 699.99, image: '/placeholder.svg?height=200&width=200' },
      { _id: '2', name: 'Laptop', description: 'High-performance laptop', price: 1299.99, image: '/placeholder.svg?height=200&width=200' },
      { _id: '3', name: 'Headphones', description: 'Noise-cancelling headphones', price: 199.99, image: '/placeholder.svg?height=200&width=200' },
    ]
    setProducts(mockProducts)
  }

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id)
      if (existingItem) {
        return prevCart.map(item => 
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId))
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
    } else {
      setCart(prevCart => prevCart.map(item => 
        item._id === productId ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <header className="p-4 bg-white shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">E-Commerce Store</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="relative">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your Cart</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between items-center mb-2">
                  <span>{item.name}</span>
                  <div className="flex items-center">
                    <Button variant="outline" size="icon" onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="mt-4 text-right">
                <strong>Total: ${totalPrice.toFixed(2)}</strong>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </header>
      <main className="container mx-auto mt-8 p-4">
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product._id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
                <p>{product.description}</p>
                <p className="mt-2 text-lg font-bold">${product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => addToCart(product)} className="w-full">
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

