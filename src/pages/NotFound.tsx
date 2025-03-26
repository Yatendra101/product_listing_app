
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-16 container mx-auto max-w-6xl flex flex-col items-center justify-center text-center">
        <div className="glass-morphism p-8 rounded-2xl max-w-md animate-fade-in">
          <div className="p-4 rounded-full bg-secondary inline-flex mb-4">
            <PackageX className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <h1 className="text-4xl font-semibold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Oops! We couldn't find the page you're looking for.
          </p>
          
          <Link to="/">
            <Button className="rounded-full px-8">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;