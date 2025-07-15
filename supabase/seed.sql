-- Seed data for the clients table
INSERT INTO clients (name, email, address, vat_number) VALUES
('Innovate LLC', 'contact@innovatellc.com', '789 Innovation Drive, Techville', 'IL12345'),
('Quantum Solutions', 'hello@quantumsolutions.dev', '101 Quantum Way, Future City', 'QS67890'),
('Apex Industries', 'info@apexindustries.com', '234 Summit Peak, Mountain View', 'AI54321'),
('Starlight Media', 'press@starlightmedia.net', '567 Galaxy Blvd, Hollywood', 'SM98765'),
('Greenleaf Organics', 'support@greenleaf.org', '890 Grove Lane, Evergreen', 'GO13579');

-- Seed data for the items table
INSERT INTO items (description, rate) VALUES
('Graphic Design', 150.00),
('Consulting Services', 200.00),
('Software Development', 250.00);

-- Seed data for the invoices and invoice_items tables
DO $$
DECLARE
    client1_id_val int;
    client2_id_val int;
    item1_id_val int;
    item2_id_val int;
    item3_id_val int;
    invoice1_id_val int;
    invoice2_id_val int;
BEGIN
    -- Get client and item IDs
    SELECT id INTO client1_id_val FROM clients WHERE name = 'Innovate LLC';
    SELECT id INTO client2_id_val FROM clients WHERE name = 'Quantum Solutions';
    SELECT id INTO item1_id_val FROM items WHERE description = 'Graphic Design';
    SELECT id INTO item2_id_val FROM items WHERE description = 'Consulting Services';
    SELECT id INTO item3_id_val FROM items WHERE description = 'Software Development';

    -- Create invoice 1 for Innovate LLC
    INSERT INTO invoices (client_id, invoice_number, issue_date, due_date, status, notes, tax_percent, discount_percent)
    VALUES (client1_id_val, 'INV-001', '2024-05-01', '2024-05-31', 'paid', 'Thank you for your business.', 8, 5)
    RETURNING id INTO invoice1_id_val;

    -- Add items to invoice 1
    INSERT INTO invoice_items (invoice_id, item_id, description, quantity, rate)
    VALUES
    (invoice1_id_val, item1_id_val, 'Logo and brand identity design', 1, 1500.00),
    (invoice1_id_val, item2_id_val, 'Initial consultation', 2, 200.00);

    -- Create invoice 2 for Quantum Solutions
    INSERT INTO invoices (client_id, invoice_number, issue_date, due_date, status, notes, tax_percent, discount_percent)
    VALUES (client2_id_val, 'INV-002', '2024-05-15', '2024-06-15', 'sent', 'Project milestone 1 payment.', 10, 0)
    RETURNING id INTO invoice2_id_val;

    -- Add items to invoice 2
    INSERT INTO invoice_items (invoice_id, item_id, description, quantity, rate)
    VALUES
    (invoice2_id_val, item3_id_val, 'Backend API development', 40, 100.00),
    (invoice2_id_val, item3_id_val, 'Database schema design', 10, 120.00);

END $$;
