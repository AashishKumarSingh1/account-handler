"use client";
import React, { useEffect, useState } from 'react';
import Data_table from '@/components/(dashbord)/dispatcher/data_table';
import Add_form from '@/components/(dashbord)/dispatcher/add_form';

const DispatchManagement = () => {
  const [partners, setPartners] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchPartnersAndDispatches() {
    try {
      const [partnersRes, dispatchesRes] = await Promise.all([
        fetch('/api/partner?type=partner_and_agency', { cache: 'no-store' }),
        fetch('/api/dispatch', { cache: 'no-store' }),
      ]);

      if (!partnersRes.ok || !dispatchesRes.ok) {
        throw new Error('Failed to fetch partners or dispatches');
      }

      const partnersData = await partnersRes.json();
      const dispatchesData = await dispatchesRes.json();
      console.log("dispatch",dispatchesData.data);
      setPartners(partnersData.partners);
      setDispatches(dispatchesData.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching partners and dispatches:', error);
    }
  }

  useEffect(() => {
    fetchPartnersAndDispatches();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dispatch Management</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>

          <Add_form
            partners={partners}
            onDispatchCreated={fetchPartnersAndDispatches}
          />

         <Data_table dispatches={dispatches} />

        </>
      )}
    </div>
  );
};

export default DispatchManagement;
