import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 text-center fade-in slide-up">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-light mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="liquid-button inline-flex items-center">
          <FiArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
