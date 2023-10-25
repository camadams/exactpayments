import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import SignIn from "~/pages/auth/signin";
import { connectionStatuss } from "~/pages/connections";
import { api } from "~/utils/api";

export function DialogDemo() {
  const { data: sesh } = useSession();
  if (!sesh?.user.id)
    return (
      <div>
        <SignIn />
      </div>
    );

  const { data: usersExceptMeAndNotSellingTo } = api.user.getAllExceptMeAndNotSellingTo.useQuery({ userId: sesh?.user.id });

  const createConnectionMutation = api.connection.create.useMutation({ onSettled: () => alert("done") });
  function handleCreateConnection(index: number) {
    if (sesh && usersExceptMeAndNotSellingTo) {
      createConnectionMutation.mutate({
        sellingUserId: sesh.user.id,
        buyingUserId: usersExceptMeAndNotSellingTo[index]!.id,
        status: connectionStatuss.PENDING,
        // sentFromUserId: sesh.user.id,
        sentFromUserId: 1,
      });
    } else {
      alert("No user or session");
    }
  }
  if (!usersExceptMeAndNotSellingTo) return <div>Loading...</div>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add connection</DialogTitle>
          {/* <DialogDescription>Make changes to your profile here. Click save when youre done.</DialogDescription> */}
        </DialogHeader>
        {/* <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>*/}
        {usersExceptMeAndNotSellingTo.length === 0 ? (
          <div>You are connected to everyone</div>
        ) : (
          usersExceptMeAndNotSellingTo.map((user, i) => (
            <div key={i} className="flex justify-between">
              <div className="">{user.email}</div>
              <button onClick={() => handleCreateConnection(i)} className="p-2 bg-green-400 rounded-xl">
                Add
              </button>
            </div>
          ))
        )}
        <DialogFooter>{/* <Button type="submit">Save changes</Button> */}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
