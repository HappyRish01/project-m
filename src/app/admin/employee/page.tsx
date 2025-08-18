
import SignupForm from "@/components/RegisterForm" 
// interface AddPartyFormProps {
//   onSubmit: (party: Party) => void;
//   onCancel?: () => void;
// }

export default function AddPartyForm() {
  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        {/* <LoginForm /> */}
        <SignupForm />
      </div>
    );
}
