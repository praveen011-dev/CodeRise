import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { MailOpen } from "lucide-react";

function App() {
  return (
    <div>
      <h1>chintu</h1>
      <Button variant="default">default button</Button>
      <Button variant="destructive">destruvtive button</Button>
      <li className={buttonVariants({ variant: "outline" })}>Click here</li>

      <Button>
        <MailOpen /> Login with Email
      </Button>
    </div>
  );
}

export default App;
