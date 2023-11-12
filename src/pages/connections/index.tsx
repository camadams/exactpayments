/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { useSession } from "next-auth/react";
import Image from "next/image";
import { api } from "~/utils/api";
import { DialogDemo } from "~/components/DialogDemo";

export enum connectionStatuss {
  PENDING,
  ACCEPTED,
}

export default function App() {
  const { data: sesh } = useSession();
  // const { data: connections, isLoading } = api.connection.getConnectionsByUserId.useQuery({ userId: userId });
  const { data: connectionsIAmSellingTo, isLoading: isLoadingBuyingFromMe } = api.connection.getMyConnectionsWhereIAmX.useQuery({
    userId: sesh?.user.id,
    isSelling: true,
  });
  const { data: connectionsIAmBuyingFrom } = api.connection.getMyConnectionsWhereIAmX.useQuery({ userId: sesh?.user.id, isSelling: false });
  const updateMutation = api.connection.updateStatus.useMutation({
    onSettled(data, error, variables, context) {
      alert(`Update settled. Error: ${error?.message}`);
    },
  });

  if (isLoadingBuyingFromMe) {
    return <h1>Loading...</h1>;
  }

  console.log({ connectionsIAmBuyingFrom, connectionsIAmSellingTo });

  function getDisplayValue(status: number, sentFromUserId: number, connectionId: number) {
    const displayValue = "";
    if (status === connectionStatuss.ACCEPTED) {
      return "Accepted";
    } else if (status === connectionStatuss.PENDING && sentFromUserId == sesh?.user.id) {
      return "Connection Request Sent";
    } else if (status === connectionStatuss.PENDING && sentFromUserId != sesh?.user.id) {
      // return <AcceptOrReject {...connectionId} />;
      return <AcceptOrReject connectionId={connectionId} />;
    }
    return "error";
  }

  function handleUpdate(connectionId: number, connectionStatus: number) {
    console.log({ connectionId });

    updateMutation.mutate({ connectionId, connectionStatus });
  }

  function AcceptOrReject({ connectionId }: { connectionId: number }) {
    return (
      <>
        <button
          className="p-1 mr-1 bg-green-300 rounded-lg hover:bg-green-200"
          onClick={() => handleUpdate(connectionId, connectionStatuss.ACCEPTED)}
        >
          accept
        </button>
        <button className="p-1 bg-pink-300 rounded-lg hover:bg-pink-200" onClick={() => alert("not implemented yet")}>
          reject
        </button>
      </>
    );
  }

  function a() {
    return <div>hi</div>;
  }

  return (
    <div className="p-6">
      <div className="p-2 mb-4 rounded-lg bg-slate-300">
        <h1 className="p-2 rounded-sm bg-slate-400">I am buying from:</h1>
        {connectionsIAmBuyingFrom && connectionsIAmBuyingFrom.length !== 0 ? (
          <table>
            <thead>
              <tr>
                <th className="px-2 border-2 border-slate-800">Name</th>
                <th className="px-2 border-2 border-slate-800">Email</th>
                <th className="px-2 border-2 border-slate-800">Photo</th>
                <th className="px-2 border-2 border-slate-800">Status</th>
              </tr>
            </thead>
            <tbody>
              {connectionsIAmBuyingFrom?.map((connect) => (
                <tr key={connect?.id}>
                  <td>{connect?.name}</td>
                  <td>{connect?.email}</td>
                  <td>
                    {/* <Image src={connection?.image} alt="Hi" width={80} height={80} /> */}
                    <Image src="https://picsum.photos/300/300" alt="Hi" width={80} height={80} />
                  </td>
                  <td className="px-2 border-2 border-slate-800">{getDisplayValue(connect.status, connect.sentFromUserId, connect.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h1>No one</h1>
        )}
      </div>

      <div className="p-2 mb-4 rounded-lg bg-slate-300">
        <h1 className="p-2 rounded-sm bg-slate-400">I am selling to:</h1>
        {connectionsIAmSellingTo && connectionsIAmSellingTo.length !== 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th className="px-2 border-2 border-slate-800">Name</th>
                  <th className="px-2 border-2 border-slate-800">Email</th>
                  <th className="px-2 border-2 border-slate-800">Photo</th>
                  <th className="px-2 border-2 border-slate-800">Status</th>
                </tr>
              </thead>
              <tbody>
                {connectionsIAmSellingTo?.map((connect) => (
                  <tr key={connect?.id}>
                    <td className="px-2 border-2 border-slate-800">{connect?.name}</td>
                    <td className="px-2 border-2 border-slate-800">{connect?.email}</td>
                    <td className="px-2 border-2 border-slate-800">
                      {/* <Image src={connection?.image} alt="Hi" width={80} height={80} /> */}
                      <Image src="https://picsum.photos/300/300" alt="Hi" width={80} height={80} />
                    </td>
                    <td className="px-2 border-2 border-slate-800">{getDisplayValue(connect.status, connect.sentFromUserId, connect.id)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <h1>No one</h1>
            <DialogDemo />
          </>
        )}
      </div>
    </div>
  );
}

// const Button: React.FC = () => {
//   const [modalIsOpen, setModalIsOpen] = useState(false);

//   const openModal = () => {
//     setModalIsOpen(true);
//   };

//   const closeModal = () => {
//     setModalIsOpen(false);
//   };

//   return (
//     <div>
//       <button className="p-2 bg-green-400 rounded-lg" onClick={openModal}>
//         Open Modal
//       </button>
//       <CustomModal isOpen={modalIsOpen} closeModal={closeModal} />
//     </div>
//   );
// };

// interface ModalProps {
//   isOpen: boolean;
//   closeModal: () => void;
// }
// import Modal from "react-modal";

// const CustomModal: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
//   return (
//     <Modal isOpen={isOpen} onRequestClose={closeModal} contentLabel="Modal">
//       <h2>Modal Content</h2>
//       <button onClick={closeModal}>Close</button>
//     </Modal>
//   );
// };
