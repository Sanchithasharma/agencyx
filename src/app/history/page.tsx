"use client";
import login from "../../firebase/login";
import { useRouter } from "next/navigation";

import { FormEvent, useEffect, useState } from "react";
import { signOut } from "../../firebase/signout";
import { DialogBox } from "../../components/dialog";
import { db } from "../../firebase/firestore";
import { collection, getDocs, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase_app from "../../../config";

const TABLE_HEADER = ["URL", "View"];

async function getAllDocuments(collectionName: string) {
  console.log({ collectionName });
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);
  const documents = snapshot.docs.map((doc) => {
    return {
      documentId: doc.id,
      metaTags: doc.data(),
    };
  });
  return documents;
}

export default function History() {
  // redirect away from this page, if user is not logged in
  // refer to the implementation on the main app page
  const [documents, setDocuments] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(getAuth(firebase_app).currentUser);
  const auth = getAuth(firebase_app);

  const router = useRouter();
  console.log({ loggedInUser: user?.email });


  let user = sessionStorage.getItem("user");


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("loggedInUser");
      }
      setUser(user);
      if (!user) {
        router.push("/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth, router]);
  const handleLogout = async () => {
    try {
      await signOut();
      // The onAuthStateChanged will handle updating the user state
      // and redirecting if necessary.
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  useEffect(() => {
    const fetchDataAndNames = async () => {
      const loggedInUser = await getAuth(firebase_app);
      console.log({ currentUser: loggedInUser.currentUser });

      // homework, correctly fetch the logged in user
      const fetchedDocuments = await getAllDocuments(user);
      setDocuments(fetchedDocuments);
    };

    fetchDataAndNames();
  }, []);

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1>Past Reports</h1>
      {user && (
        <button
          type="button"
          onClick={handleLogout}
          className="bg-brown-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      )}
      <div className="p-8">
        <table className="table-auto border p-2">
          <thead>
            <tr>
              {TABLE_HEADER.map((key, i) => (
                <th
                  className="font-bold py-2 px-4 border-b border-l text-center"
                  key={i}
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {documents.map((el, i) => (
              <tr key={i}>
                <td className="p-2 border-b border-l text-left">
                  {el.documentId}
                </td>
                <td className="p-2 border-b border-l text-left">
                  <button
                    className="bg-brown-200 py-2 px-6 rounded-lg text-400 hover:bg-wheat"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    View
                  </button>
                </td>
                <DialogBox
                  open={open}
                  handleClose={() => setOpen(false)}
                  body={el.metaTags}
                />
              </tr>
            ))}
            {/* <tr>
              <td className="p-2 border-b text-left">
                The Sliding Mr. Bones (Next Stop, Pottersville)
              </td>
              <td className="p-2 border-b text-left">Malcolm Lockyer</td>
            </tr>
            <tr>
              <td className="p-2 border-b text-left">Witchy Woman</td>
              <td className="p-2 border-b text-left">The Eagles</td>
            </tr>
            <tr>
              <td className="p-2 border-b text-left">Shining Star</td>
              <td className="p-2 border-b text-left">Earth, Wind, and Fire</td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </main>
  );
}
