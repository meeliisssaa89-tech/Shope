import { useState } from 'react';
import { Plus, Check, ShoppingBag } from 'lucide-react';
import { useStore } from '@/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'horizontal';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { addToCart } = useStore();
  const [isAdded, setIsAdded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.colors?.[0]);

  const handleAddToCart = () => {
    addToCart(product, 1, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-EG').format(price);
  };

  if (variant === 'compact') {
    return (
      <>
        <div 
          className="group relative bg-white rounded-xl overflow-hidden shadow-card card-hover cursor-pointer"
          onClick={() => setShowDetails(true)}
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.originalPrice && (
              <span className="absolute top-3 left-3 bg-cobalt text-white text-xs font-bold px-2 py-1 rounded">
                خصم
              </span>
            )}
            {product.isNew && (
              <span className="absolute top-3 right-3 bg-ink text-white text-xs font-bold px-2 py-1 rounded">
                جديد
              </span>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-bold text-ink mb-1 line-clamp-1">{product.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-cobalt font-bold">{formatPrice(product.price)} ج.م</span>
              {product.originalPrice && (
                <span className="text-text-muted text-sm line-through">
                  {formatPrice(product.originalPrice)} ج.م
                </span>
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="absolute bottom-4 left-4 w-10 h-10 bg-ink text-paper rounded-full flex items-center justify-center transition-all duration-200 hover:bg-cobalt hover:scale-110"
          >
            {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        </div>

        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="sm:max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>{product.name}</DialogTitle>
            </DialogHeader>
            <ProductDetails 
              product={product} 
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              onAddToCart={handleAddToCart}
              isAdded={isAdded}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (variant === 'horizontal') {
    return (
      <>
        <div 
          className="group flex gap-4 bg-white rounded-xl overflow-hidden shadow-card card-hover cursor-pointer p-3"
          onClick={() => setShowDetails(true)}
        >
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="font-bold text-ink mb-1">{product.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-cobalt font-bold">{formatPrice(product.price)} ج.م</span>
              {product.originalPrice && (
                <span className="text-text-muted text-sm line-through">
                  {formatPrice(product.originalPrice)} ج.م
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="w-fit px-4 py-2 bg-ink text-paper text-sm rounded-lg flex items-center gap-2 transition-all duration-200 hover:bg-cobalt"
            >
              {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isAdded ? 'تم الإضافة' : 'أضف للسلة'}</span>
            </button>
          </div>
        </div>

        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="sm:max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>{product.name}</DialogTitle>
            </DialogHeader>
            <ProductDetails 
              product={product} 
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              onAddToCart={handleAddToCart}
              isAdded={isAdded}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Default variant
  return (
    <>
      <div 
        className="group relative bg-white rounded-2xl overflow-hidden shadow-card card-hover cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.originalPrice && (
            <span className="absolute top-4 left-4 bg-cobalt text-white text-sm font-bold px-3 py-1 rounded-full">
              خصم
            </span>
          )}
          {product.isNew && (
            <span className="absolute top-4 right-4 bg-ink text-white text-sm font-bold px-3 py-1 rounded-full">
              جديد
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-5">
          <h3 className="font-bold text-lg text-ink mb-2 line-clamp-1">{product.name}</h3>
          <p className="text-text-secondary text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-cobalt font-bold text-lg">{formatPrice(product.price)} ج.م</span>
              {product.originalPrice && (
                <span className="text-text-muted text-sm line-through">
                  {formatPrice(product.originalPrice)} ج.م
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="w-12 h-12 bg-ink text-paper rounded-full flex items-center justify-center transition-all duration-200 hover:bg-cobalt hover:scale-110"
            >
              {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
          </DialogHeader>
          <ProductDetails 
            product={product} 
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            onAddToCart={handleAddToCart}
            isAdded={isAdded}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

interface ProductDetailsProps {
  product: Product;
  selectedSize?: string;
  setSelectedSize: (size: string) => void;
  selectedColor?: string;
  setSelectedColor: (color: string) => void;
  onAddToCart: () => void;
  isAdded: boolean;
}

function ProductDetails({ 
  product, 
  selectedSize, 
  setSelectedSize, 
  selectedColor, 
  setSelectedColor,
  onAddToCart,
  isAdded 
}: ProductDetailsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-EG').format(price);
  };

  return (
    <div className="space-y-4">
      <div className="aspect-[4/3] rounded-lg overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <p className="text-text-secondary">{product.description}</p>
      
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">المقاس:</label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size: string) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedSize === size 
                    ? 'bg-ink text-paper border-ink' 
                    : 'bg-white text-ink border-gray-200 hover:border-ink'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {product.colors && product.colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">اللون:</label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color: string) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedColor === color 
                    ? 'bg-ink text-paper border-ink' 
                    : 'bg-white text-ink border-gray-200 hover:border-ink'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2">
          <span className="text-cobalt font-bold text-xl">{formatPrice(product.price)} ج.م</span>
          {product.originalPrice && (
            <span className="text-text-muted line-through">
              {formatPrice(product.originalPrice)} ج.م
            </span>
          )}
        </div>
        <Button 
          onClick={onAddToCart}
          className={`gap-2 ${isAdded ? 'bg-green-600' : 'bg-ink hover:bg-cobalt'}`}
        >
          {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          <span>{isAdded ? 'تم الإضافة' : 'أضف للسلة'}</span>
        </Button>
      </div>
    </div>
  );
}
