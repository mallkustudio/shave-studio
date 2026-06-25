import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-start justify-center pt-32">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/services-bg.jpg')", backgroundAttachment: "fixed", zIndex: -20 }}
      />
      <div
        className="fixed inset-0"
        style={{ backgroundColor: "rgba(10,10,10,0.85)", zIndex: -10 }}
      />
      <LoginForm />
    </div>
  );
}
