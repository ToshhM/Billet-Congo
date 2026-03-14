import { getCurrentUser } from '@/features/auth/server/auth.actions';
import { paymentService } from '@/features/checkout/services/payment.service';
import { getEventById } from '@/features/events/services/event.service';
import { redirect, notFound } from 'next/navigation';
import { Card } from '@/shared/components/ui/Card';
import Link from 'next/link';
// Un composant de génération de QR Code (ici on mock en CSS ou image pour le MVP)
// npm i react-qr-code (Pourrait être ajouté plus tard)

interface PageProps {
    params: Promise<{ ticketId: string }>;
}

export default async function TicketPage({ params }: PageProps) {
    const resolvedParams = await params;
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    // Dans un cas réel, getTicketById(...)
    // Pour le MVP mock, on récupère tous les tickets du user et on filtre
    const tickets = await paymentService.getUserTickets(user.id);
    const ticket = tickets.find(t => t.id === resolvedParams.ticketId);

    if (!ticket) {
        notFound();
    }

    const event = await getEventById(ticket.eventId);

    if (!event) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-16 flex justify-center">
            <div className="max-w-md w-full">
                <div className="mb-6">
                    <Link href="/account" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                        ← Retour à mon espace
                    </Link>
                </div>

                <Card className="overflow-hidden shadow-2xl bg-white text-black relative">
                    {/* Tag de statut */}
                    <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 pb-1.5 rounded-full text-xs font-bold ${ticket.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-700'
                            }`}>
                            {ticket.status === 'PAID' ? 'Payé - Valide' : ticket.status}
                        </span>
                    </div>

                    <div className="p-8 text-center border-b-2 border-dashed border-neutral-200">
                        <div className="w-16 h-16 mx-auto bg-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                            <span className="text-2xl text-white">🎟️</span>
                        </div>
                        <h1 className="text-2xl font-bold mb-2 uppercase leading-tight">{event.title}</h1>
                        <p className="text-neutral-500 font-medium">Billet Standard</p>
                    </div>

                    <div className="p-8 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-neutral-500 text-xs font-bold uppercase mb-1">Date</p>
                                <p className="font-semibold">{new Date(event.startDate).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div>
                                <p className="text-neutral-500 text-xs font-bold uppercase mb-1">Heure</p>
                                <p className="font-semibold">{new Date(event.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-neutral-500 text-xs font-bold uppercase mb-1">Lieu</p>
                                <p className="font-semibold">{event.location}</p>
                            </div>
                            <div className="col-span-2 pt-4">
                                <p className="text-neutral-500 text-xs font-bold uppercase mb-1">Participant</p>
                                <p className="font-bold text-lg">{user.fullName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-50 p-8 flex flex-col items-center justify-center border-t border-solid border-neutral-200">
                        {/* Simulation d'un QR code */}
                        <div className="w-48 h-48 bg-white border-2 border-neutral-100 p-2 rounded-xl mb-4 relative overflow-hidden">
                            <div className="absolute inset-2 bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-cover opacity-80" style={{ filter: 'grayscale(100%) contrast(120%)' }}></div>
                        </div>
                        <div className="bg-neutral-200 px-4 py-2 rounded-lg">
                            <p className="text-sm font-mono tracking-widest font-bold text-neutral-800">{ticket.reference}</p>
                        </div>
                        <p className="text-xs text-neutral-400 mt-4 text-center">Présentez ce QR Code à l&apos;entrée de l&apos;événement.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
