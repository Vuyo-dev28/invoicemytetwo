'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Package, Users, Receipt, FileScan, FileDiff, Truck, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { formatCurrency as formatCurrencyUtil } from '@/lib/currency-utils';
import { Skeleton } from '@/components/ui/skeleton';

type SearchResult = {
  type: 'document' | 'item' | 'client';
  id: string;
  title: string;
  subtitle?: string;
  metadata?: string;
  status?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const documentTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Invoice': Receipt,
  'Estimate': FileScan,
  'Credit note': FileDiff,
  'Delivery note': Truck,
  'Purchase order': ShoppingCart,
};

const documentTypePaths: Record<string, string> = {
  'Invoice': '/invoices',
  'Estimate': '/estimates',
  'Credit note': '/credit_notes',
  'Delivery note': '/delivery_notes',
  'Purchase order': '/purchase_orders',
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userCurrency, setUserCurrency] = useState<string>('USD');
  const supabase = createClient();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('currency')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileData?.currency) {
        setUserCurrency(profileData.currency);
      }
    };
    getProfile();
  }, [supabase]);

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsSearching(false);
        return;
      }

      const searchResults: SearchResult[] = [];
      const searchTerm = query.trim();

      try {
        // Search documents (invoices, estimates, etc.)
        const { data: documents } = await supabase
          .from('invoices')
          .select('id, invoice_number, document_type, issue_date, total, status, client_id, clients(name)')
          .eq('user_id', user.id)
          .or(`invoice_number.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`)
          .limit(20);

        if (documents) {
          documents.forEach((doc: any) => {
            const docType = doc.document_type || 'Invoice';
            searchResults.push({
              type: 'document',
              id: doc.id,
              title: doc.invoice_number,
              subtitle: doc.clients?.name || 'No client',
              metadata: doc.issue_date 
                ? `${format(new Date(doc.issue_date), 'MMM d, yyyy')} • ${formatCurrencyUtil(doc.total || 0, userCurrency)}`
                : undefined,
              status: doc.status,
              href: `${documentTypePaths[docType] || '/invoices'}/${doc.id}/edit`,
              icon: documentTypeIcons[docType] || FileText,
            });
          });
        }

        // Search items
        const { data: items } = await supabase
          .from('items')
          .select('id, description, rate')
          .eq('user_id', user.id)
          .ilike('description', `%${searchTerm}%`)
          .limit(20);

        if (items) {
          items.forEach((item: any) => {
            searchResults.push({
              type: 'item',
              id: item.id,
              title: item.description,
              metadata: formatCurrencyUtil(item.rate || 0, userCurrency),
              href: '/items',
              icon: Package,
            });
          });
        }

        // Search clients
        const { data: clients } = await supabase
          .from('clients')
          .select('id, name, email, address')
          .eq('user_id', user.id)
          .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)
          .limit(20);

        if (clients) {
          clients.forEach((client: any) => {
            searchResults.push({
              type: 'client',
              id: client.id,
              title: client.name,
              subtitle: client.email || undefined,
              metadata: client.address || undefined,
              href: '/clients',
              icon: Users,
            });
          });
        }

        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(search, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, supabase, userCurrency]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'document': return 'Document';
      case 'item': return 'Item';
      case 'client': return 'Client';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-500';
      case 'item': return 'bg-green-500';
      case 'client': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'draft': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'sent': return 'bg-blue-500 hover:bg-blue-600';
      case 'paid': return 'bg-green-500 hover:bg-green-600';
      case 'overdue': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6 pb-4 bg-background border-b">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Search</h1>
          <p className="text-muted-foreground">Search across all your documents, items, and clients</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search documents, items, or clients..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
            autoFocus
          />
        </div>
      </div>

      {/* Scrollable Results Area */}
      <div className="flex-1 overflow-y-auto p-6 pt-4">
        {isSearching && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isSearching && query && results.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No results found for "{query}"</p>
            </CardContent>
          </Card>
        )}

        {!isSearching && results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-background pb-2 z-10">
              <p className="text-sm text-muted-foreground">
                Found {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
            </div>

            {results.map((result) => {
              const Icon = result.icon;
              return (
                <Link key={`${result.type}-${result.id}`} href={result.href}>
                  <Card className="hover:bg-accent transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${getTypeColor(result.type)} text-white flex-shrink-0`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold truncate">{result.title}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {getTypeLabel(result.type)}
                            </Badge>
                            {result.status && (
                              <Badge className={`text-xs text-white ${getStatusColor(result.status)}`}>
                                {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                              </Badge>
                            )}
                          </div>
                          {result.subtitle && (
                            <p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
                          )}
                          {result.metadata && (
                            <p className="text-xs text-muted-foreground mt-1">{result.metadata}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {!query && (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Start typing to search...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

