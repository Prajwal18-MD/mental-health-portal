// frontend/src/components/BookingModal.jsx
import React, { useState } from "react";
import Modal from "./ui/Modal";
import PatientBookingForm from "./PatientBookingForm";

/**
 * BookingModal
 * Props:
 *  - open (bool)
 *  - onClose (fn)
 *  - token (string)
 *
 * Uses PatientBookingForm to send the request. After successful creation,
 * shows a confirmation panel inside the modal.
 *
 * Requires:
 *  - ./ui/Modal.jsx
 *  - ./PatientBookingForm.jsx
 */
export default function BookingModal({ open, onClose, token }) {
  const [booking, setBooking] = useState(null);
  const [busy, setBusy] = useState(false);

  // called by PatientBookingForm when booking is created
  function handleSaved(bkg) {
    setBooking(bkg);
  }

  function handleClose() {
    setBooking(null);
    setBusy(false);
    onClose && onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title={booking ? "Booking confirmed" : "Request a booking"}>
      <div>
        {!booking ? (
          <>
            <div className="text-sm text-gray-600 mb-3">
              Choose a date & time that's convenient. If auto-assignment is needed the system will assign a therapist.
            </div>

            <PatientBookingForm
              token={token}
              onSaved={(bkg) => {
                setBooking(bkg);
              }}
              onCancel={() => {
                // keep modal open; let user decide
              }}
            />

            <div className="mt-3 text-xs text-gray-500">
              Note: If your backend rejects direct patient bookings, PatientBookingForm will fall back to the auto-booking endpoint.
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="p-4 border rounded bg-white">
              <div className="text-sm text-gray-600">Booking created successfully.</div>
              <div className="mt-2">
                <div><strong>Therapist:</strong> {booking.therapist_name ?? booking.therapist_id ?? "To be assigned"}</div>
                <div><strong>When:</strong> {booking.datetime ? new Date(booking.datetime).toLocaleString() : (booking.requested_datetime ? new Date(booking.requested_datetime).toLocaleString() : "—")}</div>
                {booking.notes && <div className="mt-2 text-sm">{booking.notes}</div>}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded bg-[#4D2B8C] text-white hover:bg-[#85409D]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // option to open the full history or export — simple close for now
                  handleClose();
                }}
                className="px-4 py-2 rounded border"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
