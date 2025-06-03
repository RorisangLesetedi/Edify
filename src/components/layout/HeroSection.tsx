import Button from '../ui/Button';

export default function HeroSection() {
  const handleGetStarted = () => {
    // Handle get started action
  };

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div 
          className="rounded-2xl overflow-hidden relative bg-cover bg-center flex items-center justify-center"
          style={{ 
            backgroundImage: 'url(/images/hero-image.png)',
            minHeight: '600px'
          }}
        >
          {/* Dark overlay for better readability */}
          <div className="absolute inset-0 bg-black/50"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-16 max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6 max-w-4xl">
              Find the Right Tutor for Your Child —Tailored Help for PSLE to A-Levels
            </h1>
            
            <p className="text-lg text-white/90 mb-8 max-w-2xl">
              Get a free assessment, choose the tutor you want, and only pay for what your child needs
            </p>
            
            <Button 
              variant="primary" 
              size="medium"
              className="bg-purple-600 text-white hover:bg-purple-700 shadow-lg border-none"
              onClick={handleGetStarted}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 