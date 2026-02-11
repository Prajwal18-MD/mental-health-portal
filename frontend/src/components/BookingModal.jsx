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

  function handleSaved(bkg) {
    setBooking(bkg);
  }

  function handleClose() {
    setBooking(null);
    setBusy(false);
    onClose && onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={booking ? "Booking Confirmed ✓" : "Book Therapist Session"}
      size="lg"
    >
      <div>
        {!booking ? (
          <>
            {/* Info Banner */}
            <div className="p-4 bg-accent-50 border-l-4 border-accent-500 rounded-lg mb-5">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-accent-900 font-medium">Schedule Your Session</p>
                  <p className="text-xs text-accent-700 mt-1">
                    Choose a convenient date and time. A therapist will be auto-assigned if needed.
                  </p>
                </div>
              </div>
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

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> If direct booking isn't supported, the system will use auto-booking mode.
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-5 animate-fadeIn">
            {/* Success Card */}
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 mb-1">Booking Created Successfully!</h3>
                  <p className="text-sm text-gray-600">Your therapy session has been scheduled</p>
                </div>
              </div>

              <div className="space-y-3 mt-5 bg-white/60 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-500">Therapist</div>
                    <div className="text-sm font-medium text-gray-900">
                      {booking.therapist_name ?? booking.therapist_id ?? "Being assigned..."}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-500">Scheduled For</div>
                    <div className="text-sm font-medium text-gray-900">
                      {booking.datetime
                        ? new Date(booking.datetime).toLocaleString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        : (booking.requested_datetime
                          ? new Date(booking.requested_datetime).toLocaleString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                          : "—")
                      }
                    </div>
                  </div>
                </div>

                {booking.notes && (
                  <div className="flex items-start gap-3 pt-2 border-t border-gray-200">
                    <svg className="w-5 h-5 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-500">Notes</div>
                      <div className="text-sm text-gray-700 mt-1">{booking.notes}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 btn-primary py-3"
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
