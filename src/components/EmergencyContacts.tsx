
import React, { useState } from 'react';
import { Phone, Mail, Plus, Trash2, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  relationship: string;
}

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Doe',
      phone: '+1 (555) 123-4567',
      email: 'john@example.com',
      relationship: 'Family'
    },
    {
      id: '2', 
      name: 'Jane Smith',
      phone: '+1 (555) 987-6543',
      email: 'jane@example.com',
      relationship: 'Friend'
    }
  ]);
  
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: ''
  });
  
  const { toast } = useToast();

  const addContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the name and phone number.",
        variant: "destructive",
      });
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      ...newContact
    };

    setContacts([...contacts, contact]);
    setNewContact({ name: '', phone: '', email: '', relationship: '' });
    setIsAddingContact(false);
    
    toast({
      title: "Contact Added",
      description: `${newContact.name} has been added to your emergency contacts.`,
    });
  };

  const removeContact = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    setContacts(contacts.filter(c => c.id !== id));
    
    toast({
      title: "Contact Removed", 
      description: `${contact?.name} has been removed from your emergency contacts.`,
    });
  };

  const callContact = (phone: string, name: string) => {
    toast({
      title: "Calling...",
      description: `Initiating call to ${name}`,
    });
    // In a real app, this would use a phone API or redirect to phone app
    window.open(`tel:${phone}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Emergency Contacts</h2>
          <button
            onClick={() => setIsAddingContact(!isAddingContact)}
            className="bg-emergency-600 hover:bg-emergency-700 text-white p-2 rounded-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {isAddingContact && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-4">
            <h3 className="font-medium text-gray-900">Add New Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newContact.email}
                onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500"
              />
              <input
                type="text"
                placeholder="Relationship"
                value={newContact.relationship}
                onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={addContact}
                className="bg-safe-600 hover:bg-safe-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
              >
                Add Contact
              </button>
              <button
                onClick={() => setIsAddingContact(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-bold text-gray-900">{contact.name}</h3>
                    {contact.relationship && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {contact.relationship}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{contact.phone}</span>
                    </div>
                    {contact.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{contact.email}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => callContact(contact.phone, contact.name)}
                    className="bg-safe-600 hover:bg-safe-700 text-white p-2 rounded-lg transition-all duration-200"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeContact(contact.id)}
                    className="bg-emergency-600 hover:bg-emergency-700 text-white p-2 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {contacts.length === 0 && (
            <div className="text-center py-8">
              <Phone className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No emergency contacts added yet.</p>
              <p className="text-sm text-gray-500 mt-1">Add contacts who should be notified during emergencies.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;
