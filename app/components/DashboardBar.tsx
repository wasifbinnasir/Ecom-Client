'use client';

import React, { useEffect, useState } from 'react';
import { FiBell, FiChevronDown, FiLogOut, FiShoppingCart, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { getNotificationSocket } from '../lib/socket';
import { RootState } from '../lib/store';
import {
  addNotification,
  setModalOpen,
  markAllRead as markAllReadLocal,
  setAll,
} from '../features/notifications/notificationsSlice';
import Toast from '../components/Toast';
import { AnimatePresence, motion } from 'framer-motion';
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllReadMutation,
} from '../services/notificationsApi';

type SocketNotificationPayload = {
  id: string;
  type: string;
  title: string;
  message: string;
  orderId?: string;
  createdAt: string;
  read: boolean;
};

export default function DashboardNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string>('');
  const dispatch = useDispatch();
  const router = useRouter();

  const modalOpen = useSelector((s: RootState) => s.notifications.modalOpen);
  const unreadCountLocal = useSelector((s: RootState) => s.notifications.unreadCount);
  const itemsLocal = useSelector((s: RootState) => s.notifications.items);

  // Load from API
  const { data: unreadData, refetch: refetchUnread } = useGetUnreadCountQuery();
  const { data: listData, refetch: refetchList } = useGetNotificationsQuery({ page: 1, limit: 20 });
  const [markAllReadApi] = useMarkAllReadMutation();

  // Hydrate local store from API on mount/data change
  useEffect(() => {
  if (listData?.items) {
    dispatch(
      setAll(
        listData.items.map((n) => ({
          id: n._id,
          title: n.title,
          message: n.message,
          createdAt: n.createdAt,
          read: n.read,
        }))
      )
    );
  }
}, [dispatch, listData]);

  // To avoid changing your slice too much, we’ll just append on socket and rely
  // on API count for the badge display in UI.
  const effectiveUnread = unreadData?.count ?? unreadCountLocal;

  useEffect(() => {
    const socket = getNotificationSocket();

    const onNew = (payload: SocketNotificationPayload) => {
      dispatch(
        addNotification({
        id: payload.id,
        title: payload.title,
        message: payload.message,
        createdAt: payload.createdAt,
        read: payload.read,
      }));
      setToastMsg(`${payload.title}: ${payload.message}`);
      // refresh server counts
      refetchUnread();
      // Optionally refetch list if modal open
      if (modalOpen) refetchList();
    };

    socket.on('notification:new', onNew);
    return () => {
      socket.off('notification:new', onNew);
    };
  }, [dispatch, modalOpen, refetchUnread, refetchList]);

  const handleOpenModal = async () => {
    dispatch(setModalOpen(true));
    // mark all read on server, then sync
    await markAllReadApi().unwrap().catch(() => {});
    dispatch(markAllReadLocal());
    refetchUnread();
    refetchList();
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <>
      <nav className="w-full bg-slate-100 shadow-md px-6 py-3 flex items-center justify-between">
        <div className="text-2xl font-extrabold text-black">
          SHOP.CO
        </div>

        <div className="flex items-center gap-4 relative">
          {/* Notification Icon */}
          <button
            className="relative text-gray-600 hover:text-gray-900 p-2 rounded-full transition-colors"
            onClick={handleOpenModal}
            aria-label="Notifications"
          >
            <FiBell size={22} />
            {effectiveUnread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
                {effectiveUnread > 99 ? '99+' : effectiveUnread}
              </span>
            )}
          </button>

          {/* Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Account
              <FiChevronDown />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-10">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  <FiShoppingCart />
                  Go to Store
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors text-left"
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Notification Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => dispatch(setModalOpen(false))}
            />

            {/* Panel */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-[92vw] sm:w-[520px] max-h-[80vh] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => dispatch(setModalOpen(false))}
                  aria-label="Close"
                >
                  <FiX />
                </button>
              </div>
              <div className="overflow-y-auto">
                {!listData || listData.items.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No notifications</div>
                ) : (
                  <ul className="divide-y">
                    {listData.items.map((n) => (
                      <li key={n._id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium">
                              {n.title}{' '}
                              {!n.read && (
                                <span className="ml-2 inline-block text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                                  New
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">{n.message}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(n.createdAt).toLocaleString()}
                            </div>
                          </div>
                          {n.orderId ? (
                            <Link
                              href={`/admin/orders/${n.orderId}`}
                              className="text-blue-600 text-sm hover:underline whitespace-nowrap"
                              onClick={() => dispatch(setModalOpen(false))}
                            >
                              View order
                            </Link>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast for new notification */}
      {toastMsg && (
        <Toast
          message={toastMsg}
          type="success"
          onClose={() => setToastMsg('')}
        />
      )}
    </>
  );
}