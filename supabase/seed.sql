-- Insert dummy data for clients
INSERT INTO public.clients (name, email, address, vat_number) VALUES
('Tech Solutions LLC', 'tech@solutions.com', '123 Innovation Drive, Techville, USA', 'TS123456'),
('Creative Minds Inc.', 'contact@creativeminds.com', '456 Art Avenue, Design City, USA', 'CM789012'),
('GreenScape Gardens', 'info@greenscape.com', '789 Nature Lane, Eco Park, USA', 'GG345678');

-- Insert dummy data for items
INSERT INTO public.items (description, rate) VALUES
('Website Development', 120.00),
('Graphic Design Services', 80.00),
('Content Writing (per hour)', 50.00),
('SEO Consulting', 150.00);

-- Insert dummy data for invoices
-- Note: We need to get the IDs of the clients we just created.
-- In a real script you might use variables, but for simple seeding we can assume IDs 1, 2, 3.
-- Make sure your clients table IDs are indeed 1, 2, 3 if you run into foreign key issues.

INSERT INTO public.invoices (client_id, invoice_number, issue_date, due_date, status, notes, tax_percent, discount_percent) VALUES
((SELECT id FROM clients WHERE name = 'Tech Solutions LLC'), 'INV-001', '2024-05-01', '2024-05-31', 'paid', 'Thank you for your business.', 10.0, 5.0),
((SELECT id FROM clients WHERE name = 'Creative Minds Inc.'), 'INV-002', '2024-05-15', '2024-06-14', 'sent', 'Payment due within 30 days.', 8.0, 0.0),
((SELECT id FROM clients WHERE name = 'GreenScape Gardens'), 'INV-003', '2024-05-20', '2024-06-04', 'draft', 'Initial draft for landscaping project.', 12.5, 10.0);

-- Insert dummy data for invoice_items
-- Corresponds to INV-001
INSERT INTO public.invoice_items (invoice_id, description, quantity, rate) VALUES
((SELECT id FROM invoices WHERE invoice_number = 'INV-001'), 'Website Development', 40, 120.00),
((SELECT id FROM invoices WHERE invoice_number = 'INV-001'), 'SEO Consulting', 10, 150.00);

-- Corresponds to INV-002
INSERT INTO public.invoice_items (invoice_id, description, quantity, rate) VALUES
((SELECT id FROM invoices WHERE invoice_number = 'INV-002'), 'Graphic Design Services', 25, 80.00),
((SELECT id FROM invoices WHERE invoice_number = 'INV-002'), 'Content Writing (per hour)', 15, 50.00);

-- Corresponds to INV-003
INSERT INTO public.invoice_items (invoice_id, description, quantity, rate) VALUES
((SELECT id FROM invoices WHERE invoice_number = 'INV-003'), 'Landscaping Consultation', 5, 100.00);
