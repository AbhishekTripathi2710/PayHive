import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  getPaymentMethods,
  createStripeCustomer,
  createSetupIntent,
  saveCard,
} from "../api/paymentMethods";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function AddCardForm({ onClose, refresh }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleAddCard = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const setupIntentRes = await createSetupIntent();
      const clientSecret = setupIntentRes.data.clientSecret;

      const cardElement = elements.getElement(CardElement);

      const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      await saveCard(setupIntent.payment_method);

      alert("Card added successfully!");
      refresh();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add card.");
    }

    setLoading(false);
  };


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-96 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add New Card</h2>

        <div className="border p-3 rounded mb-4 bg-white">
          <CardElement className="p-2" />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleAddCard}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            {loading ? "Saving..." : "Add Card"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentMethods() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);

  const fetchCards = async () => {
    try {
      const res = await getPaymentMethods();
      setCards(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load payment methods.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);


  return (
    <div className="relative flex min-h-screen bg-[#F3F4F8]">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Payment Methods
            </h1>

            <button
              onClick={() => setShowAddCard(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg shadow flex items-center gap-2"
            >
              Add Card
            </button>
          </div>

          <div className="bg-white border rounded-xl shadow p-6">
            {loading ? (
              <p className="text-slate-500">Loading cards...</p>
            ) : cards.length === 0 ? (
              <p className="text-slate-500">No saved cards yet.</p>
            ) : (
              <ul className="space-y-4">
                {cards.map((card) => (
                  <li
                    key={card.id}
                    className="border p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">
                        {card.brand?.toUpperCase()} •••• {card.last4}
                      </p>
                      <p className="text-sm text-slate-500">
                        Expires {card.expMonth}/{card.expYear}
                      </p>
                    </div>

                    {card.isDefault && (
                      <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        Default
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      {showAddCard && (
        <Elements stripe={stripePromise}>
          <AddCardForm
            onClose={() => setShowAddCard(false)}
            refresh={fetchCards}
          />
        </Elements>
      )}
    </div>
  );
}
