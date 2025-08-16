-- Step 1: Create the database and use it
CREATE DATABASE thana_management;
USE thana_management;

-- Step 2: Create the Thana table
CREATE TABLE Thana (
    thana_id INT PRIMARY KEY,
    name VARCHAR(100),
    address VARCHAR(255),
    contact BIGINT
);

-- Insert into Thana
INSERT INTO Thana (thana_id, name, address, contact) VALUES
(1, 'Mirpur Thana', 'Mirpur, Dhaka', 01711111111),
(2, 'Gulshan Thana', 'Gulshan-2, Dhaka', 01722222222),
(3, 'Dhanmondi Thana', 'Dhanmondi, Dhaka', 01733333333),
(4, 'Mohammadpur Thana', 'Mohammadpur, Dhaka', 01744444444),
(5, 'Uttara Thana', 'Uttara, Dhaka', 01755555555),
(6, 'Tejgaon Thana', 'Tejgaon, Dhaka', 01766666666),
(7, 'Motijheel Thana', 'Motijheel, Dhaka', 01777777777),
(8, 'Paltan Thana', 'Paltan, Dhaka', 01788888888),
(9, 'Badda Thana', 'Badda, Dhaka', 01799999999),
(10, 'Banani Thana', 'Banani, Dhaka', 01810101010),
(11, 'Lalbagh Thana', 'Lalbagh, Dhaka', 01811111112),
(12, 'Demra Thana', 'Demra, Dhaka', 01812121212),
(13, 'Jatrabari Thana', 'Jatrabari, Dhaka', 01813131313),
(14, 'Ramna Thana', 'Ramna, Dhaka', 01814141414),
(15, 'Shahbagh Thana', 'Shahbagh, Dhaka', 01815151515),
(16, 'Khilgaon Thana', 'Khilgaon, Dhaka', 01816161616),
(17, 'Sabujbagh Thana', 'Sabujbagh, Dhaka', 01817171717),
(18, 'Hazaribagh Thana', 'Hazaribagh, Dhaka', 01818181818),
(19, 'Bhashantek Thana', 'Bhashantek, Dhaka', 01819191919),
(20, 'Kafrul Thana', 'Kafrul, Dhaka', 01820202020),
(21, 'Kalabagan Thana', 'Kalabagan, Dhaka', 01821212121),
(22, 'Agargaon Thana', 'Agargaon, Dhaka', 01822222222),
(23, 'Cantonment Thana', 'Cantonment, Dhaka', 01823232323),
(24, 'Turag Thana', 'Turag, Dhaka', 01824242424),
(25, 'Sutrapur Thana', 'Sutrapur, Dhaka', 01825252525),
(26, 'Wari Thana', 'Wari, Dhaka', 01826262626),
(27, 'Kotwali Thana', 'Kotwali, Dhaka', 01827272727),
(28, 'Keraniganj Thana', 'Keraniganj, Dhaka', 01828282828),
(29, 'Gazipur Sadar Thana', 'Gazipur, Dhaka', 01829292929),
(30, 'Narayanganj Sadar Thana', 'Narayanganj, Dhaka', 01830303030);

SELECT * FROM Thana;


-- Step 3: Create the Victim table
CREATE TABLE Victim (
    victim_id INT PRIMARY KEY,
    name VARCHAR(100),
    nid BIGINT,
    address VARCHAR(255),
    phone BIGINT
);

ALTER TABLE Victim
MODIFY COLUMN phone VARCHAR(20);

-- Insert into Victim
INSERT INTO Victim (victim_id, name, nid, address, phone) VALUES
(1, 'Rahim Uddin', 1999123456, 'Kallyanpur, Dhaka', 01811111111),
(2, 'Salma Akter', 1998789456, 'Banani, Dhaka', 01822222222),
(3, 'Abul Kalam', 1998234567, 'Mirpur, Dhaka', 01833333333),
(4, 'Shirin Sultana', 1997567890, 'Tejgaon, Dhaka', 01844444444),
(5, 'Faruk Hossain', 1999345678, 'Uttara, Dhaka', 01855555555),
(6, 'Nasima Begum', 1999678912, 'Gulshan, Dhaka', 01866666666),
(7, 'Jamal Uddin', 1999123789, 'Mohammadpur, Dhaka', 01877777777),
(8, 'Shamsun Nahar', 1998123490, 'Dhanmondi, Dhaka', 01888888888),
(9, 'Mizanur Rahman', 1999234561, 'Motijheel, Dhaka', 01899999999),
(10, 'Munni Khatun', 1998345612, 'Paltan, Dhaka', 01910101010),
(11, 'Hasan Mahmud', 1999456723, 'Badda, Dhaka', 01911111111),
(12, 'Afsana Jahan', 1999567834, 'Khilgaon, Dhaka', 01912121212),
(13, 'Sazzad Hossain', 1999678945, 'Jatrabari, Dhaka', 01913131313),
(14, 'Razia Sultana', 1999789056, 'Demra, Dhaka', 01914141414),
(15, 'Kamal Mia', 1999890167, 'Shahbagh, Dhaka', 01915151515),
(16, 'Lubna Hossain', 1999901278, 'Ramna, Dhaka', 01916161616),
(17, 'Tariq Aziz', 1999112389, 'Wari, Dhaka', 01917171717),
(18, 'Mehnaz Akter', 1999223490, 'Sutrapur, Dhaka', 01918181818),
(19, 'Azizur Rahman', 1999334501, 'Kalabagan, Dhaka', 01919191919),
(20, 'Rehana Sultana', 1999445612, 'Lalbagh, Dhaka', 01920202020),
(21, 'Rafiqul Islam', 1999556723, 'Hazaribagh, Dhaka', 01921212121),
(22, 'Nur Jahan', 1999667834, 'Turag, Dhaka', 01922222222),
(23, 'Abida Sultana', 1999778945, 'Kafrul, Dhaka', 01923232323),
(24, 'Jahangir Alam', 1999889056, 'Cantonment, Dhaka', 01924242424),
(25, 'Morshed Alam', 1999990167, 'Agargaon, Dhaka', 01925252525),
(26, 'Sonia Akter', 2000111278, 'Keraniganj, Dhaka', 01926262626),
(27, 'Ashraful Islam', 2000222389, 'Gazipur, Dhaka', 01927272727),
(28, 'Rumana Haque', 2000333490, 'Narayanganj, Dhaka', 01928282828),
(29, 'Shahidul Islam', 2000444501, 'Kotwali, Dhaka', 01929292929),
(30, 'Nargis Sultana', 2000555612, 'Sabujbagh, Dhaka', 01930303030);

-- UPDATE Victim
-- SET phone = CONCAT('0', phone)
-- WHERE phone NOT LIKE '0%' AND victim_id IS NOT NULL;



UPDATE Victim SET phone = '01811111111' WHERE victim_id = 1;
UPDATE Victim SET phone = '01822222222' WHERE victim_id = 2;
UPDATE Victim SET phone = '01833333333' WHERE victim_id = 3;
UPDATE Victim SET phone = '01844444444' WHERE victim_id = 4;
UPDATE Victim SET phone = '01855555555' WHERE victim_id = 5;
UPDATE Victim SET phone = '01866666666' WHERE victim_id = 6;
UPDATE Victim SET phone = '01877777777' WHERE victim_id = 7;
UPDATE Victim SET phone = '01888888888' WHERE victim_id = 8;
UPDATE Victim SET phone = '01899999999' WHERE victim_id = 9;
UPDATE Victim SET phone = '01910101010' WHERE victim_id = 10;
UPDATE Victim SET phone = '01911111111' WHERE victim_id = 11;
UPDATE Victim SET phone = '01912121212' WHERE victim_id = 12;
UPDATE Victim SET phone = '01913131313' WHERE victim_id = 13;
UPDATE Victim SET phone = '01914141414' WHERE victim_id = 14;
UPDATE Victim SET phone = '01915151515' WHERE victim_id = 15;
UPDATE Victim SET phone = '01916161616' WHERE victim_id = 16;
UPDATE Victim SET phone = '01917171717' WHERE victim_id = 17;
UPDATE Victim SET phone = '01918181818' WHERE victim_id = 18;
UPDATE Victim SET phone = '01919191919' WHERE victim_id = 19;
UPDATE Victim SET phone = '01920202020' WHERE victim_id = 20;
UPDATE Victim SET phone = '01921212121' WHERE victim_id = 21;
UPDATE Victim SET phone = '01922222222' WHERE victim_id = 22;
UPDATE Victim SET phone = '01923232323' WHERE victim_id = 23;
UPDATE Victim SET phone = '01924242424' WHERE victim_id = 24;
UPDATE Victim SET phone = '01925252525' WHERE victim_id = 25;
UPDATE Victim SET phone = '01926262626' WHERE victim_id = 26;
UPDATE Victim SET phone = '01927272727' WHERE victim_id = 27;
UPDATE Victim SET phone = '01928282828' WHERE victim_id = 28;
UPDATE Victim SET phone = '01929292929' WHERE victim_id = 29;
UPDATE Victim SET phone = '01930303030' WHERE victim_id = 30;

SELECT * FROM Victim;

-- Step 4: Create the Crime_detection table

DROP TABLE Crime_detection;
CREATE TABLE Crime_detection (
    crime_type VARCHAR(50),      
    suspects VARCHAR(255),
    name VARCHAR(100),
    description VARCHAR(255),
    last_seen_location VARCHAR(255),
    photo VARCHAR(255),
    date DATE,
    thana_id INT,
    FOREIGN KEY (thana_id) REFERENCES Thana(thana_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE crime_detection
DROP PRIMARY KEY;
ALTER TABLE crime_detection
ADD COLUMN crime_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;


-- Insert into Crime_detection (table 3)
INSERT INTO Crime_detection (crime_type, suspects, name, description, last_seen_location, photo, date, thana_id) VALUES
('Theft', 'Unknown Male', 'Gold Theft', 'Gold necklace stolen from residence', 'Sector-13, Uttara', 'gold_theft.jpg', '2025-08-01', 1),
('Robbery', 'Group of 3', 'Bank Robbery', 'Armed robbery at Dutch Bangla Bank', 'Gulshan Circle 1', 'robbery.jpg', '2025-08-02', 2),
('Murder', 'Identified', 'Murder Case', 'Body found near lake', 'Dhanmondi Lake', 'murder.jpg', '2025-07-30', 3),
('Drug Trafficking', '2 suspects', 'Drug Bust', 'Yaba found in suitcase', 'Gabtoli Bus Terminal', 'yaba_bust.jpg', '2025-08-03', 4),
('Theft', 'Unknown', 'Phone Snatching', 'Smartphone snatched from pedestrian', 'Farmgate', 'phone_theft.jpg', '2025-08-01', 5),
('Cyber Crime', 'Unknown', 'Facebook Hacking', 'Profile hacked and ransom demanded', 'Online', 'cybercrime.jpg', '2025-08-01', 6),
('Kidnapping', '2 Men', 'Child Abduction', 'Child kidnapped from school gate', 'Mohakhali', 'kidnapping.jpg', '2025-08-02', 7),
('Arson', 'Mob', 'Political Unrest', 'Buses set on fire', 'Shahbagh', 'arson.jpg', '2025-07-29', 8),
('Extortion', 'Local Gang', 'Shopkeeper Harassed', 'Demanded money from small shop', 'Khilgaon Railgate', 'extortion.jpg', '2025-08-03', 9),
('Smuggling', 'Unknown', 'Gold Smuggling', 'Gold bars found in luggage', 'Hazrat Shahjalal Airport', 'gold_smuggling.jpg', '2025-08-02', 10),
('Rape', 'Identified', 'Sexual Assault Case', 'Victim assaulted in residence', 'Baridhara DOHS', 'rape_case.jpg', '2025-07-28', 11),
('Burglary', 'Single Male', 'Break-In', 'Cash and electronics stolen at night', 'Rampura', 'burglary.jpg', '2025-08-01', 12),
('Vandalism', 'Unidentified Group', 'School Damage', 'Chairs and windows broken', 'Banasree', 'vandalism.jpg', '2025-08-04', 13),
('Fraud', 'Fake Agent', 'Visa Scam', 'Victim scammed for Canada visa', 'Motijheel', 'fraud.jpg', '2025-07-27', 14),
('Assault', '2 Individuals', 'Street Fight', 'Physical fight over road incident', 'Science Lab', 'assault.jpg', '2025-08-01', 15),
('Cyber Crime', 'Unknown', 'Bkash Scam', 'OTP tricked and money stolen', 'Online', 'bkash_fraud.jpg', '2025-07-31', 16),
('Drug Trafficking', 'Identified', 'Drug Transit', 'Liquid cocaine found in drinks', 'Chittagong Port', 'drug_transit.jpg', '2025-07-30', 17),
('Theft', '2 Minors', 'Shop Theft', 'Chocolates and snacks stolen', 'New Market', 'shop_theft.jpg', '2025-08-03', 18),
('Murder', 'Identified', 'Dowry Killing', 'Wife killed for dowry', 'Jatrabari', 'dowry_case.jpg', '2025-07-25', 19),
('Extortion', 'Gang', 'Business Threatened', 'Demanded money via anonymous call', 'Mirpur-1', 'business_extortion.jpg', '2025-08-02', 20),
('Kidnapping', 'Ex-boyfriend', 'University Girl Abducted', 'Victim taken in microbus', 'Bashundhara Gate', 'uni_kidnap.jpg', '2025-07-29', 21),
('Fraud', 'Travel Agent', 'Hajj Scam', 'Hajj packages sold without visa', 'Narayanganj', 'hajj_fraud.jpg', '2025-08-01', 22),
('Robbery', '3 Armed Men', 'Jewelry Store Robbery', 'Gold ornaments looted', 'Chawk Bazar', 'jewelry_heist.jpg', '2025-08-01', 23),
('Arson', 'Unidentified', 'Garage Burned', 'CNG garage set on fire', 'Demra', 'garage_arson.jpg', '2025-07-26', 24),
('Cyber Crime', 'Student Hacker', 'Bank Website Down', 'DoS attack reported', 'Online', 'dos_attack.jpg', '2025-07-30', 25),
('Murder', 'Unknown', 'Railway Killing', 'Body found on train track', 'Kamalapur Station', 'railway_murder.jpg', '2025-07-28', 26),
('Theft', 'Domestic Help', 'House Theft', 'Cash and watch missing', 'Baridhara', 'domestic_theft.jpg', '2025-08-01', 27),
('Drug Trafficking', 'Youth Group', 'Yaba Party Raid', 'Drug party busted', 'Bashabo', 'drug_party.jpg', '2025-08-02', 28),
('Smuggling', 'Truck Driver', 'Coal Smuggling', 'Unregistered coal shipment', 'Dinajpur', 'coal_smuggling.jpg', '2025-08-01', 29),
('Robbery', 'Bike Gang', 'Chain Snatching', 'Women targeted on rickshaw', 'Tejgaon', 'bike_gang.jpg', '2025-08-03', 30);

SELECT * FROM Crime_detection;

-- Step 5: Create the Officer table
CREATE TABLE Officer (
    officer_id INT PRIMARY KEY,
    name VARCHAR(100),
    grade VARCHAR(50),
    email VARCHAR(100),
    phone BIGINT,
    thana_id INT,
    division_office VARCHAR(100),
    FOREIGN KEY (thana_id) REFERENCES Thana(thana_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE Officer MODIFY phone VARCHAR(15);
INSERT INTO Officer (officer_id, name, grade, email, phone, thana_id, division_office) VALUES
(1, 'Md. Al Amin', 'Inspector', 'amin.officer1@example.com', 01711111111, 1, 'Dhaka Division'),
(2, 'Sara Ahmed', 'Sub-Inspector', 'sara.officer2@example.com', 01722222222, 2, 'Dhaka Division'),
(3, 'Rafiqul Islam', 'Inspector', 'rafiq.officer3@example.com', 01733333333, 3, 'Dhaka Division'),
(4, 'Nusrat Jahan', 'Assistant Sub-Inspector', 'nusrat.officer4@example.com', 01744444444, 4, 'Dhaka Division'),
(5, 'Jahid Hasan', 'Sub-Inspector', 'jahid.officer5@example.com', 01755555555, 5, 'Dhaka Division'),
(6, 'Farhana Akter', 'Inspector', 'farhana.officer6@example.com', 01766666666, 6, 'Dhaka Division'),
(7, 'Hasan Mahmud', 'Assistant Sub-Inspector', 'hasan.officer7@example.com', 01777777777, 7, 'Dhaka Division'),
(8, 'Lina Karim', 'Sub-Inspector', 'lina.officer8@example.com', 01788888888, 8, 'Dhaka Division'),
(9, 'Rashed Khan', 'Inspector', 'rashed.officer9@example.com', 01799999999, 9, 'Dhaka Division'),
(10, 'Sumaiya Begum', 'Assistant Sub-Inspector', 'sumaiya.officer10@example.com', 01810101010, 10, 'Dhaka Division'),
(11, 'Tariq Aziz', 'Sub-Inspector', 'tariq.officer11@example.com', 01811111112, 11, 'Dhaka Division'),
(12, 'Shirin Akhter', 'Inspector', 'shirin.officer12@example.com', 01812121212, 12, 'Dhaka Division'),
(13, 'Habib Ullah', 'Assistant Sub-Inspector', 'habib.officer13@example.com', 01813131313, 13, 'Dhaka Division'),
(14, 'Anika Rahman', 'Sub-Inspector', 'anika.officer14@example.com', 01814141414, 14, 'Dhaka Division'),
(15, 'Masud Rana', 'Inspector', 'masud.officer15@example.com', 01815151515, 15, 'Dhaka Division'),
(16, 'Nazia Sultana', 'Assistant Sub-Inspector', 'nazia.officer16@example.com', 01816161616, 16, 'Dhaka Division'),
(17, 'Kamal Hossain', 'Sub-Inspector', 'kamal.officer17@example.com', 01817171717, 17, 'Dhaka Division'),
(18, 'Fatema Khatun', 'Inspector', 'fatema.officer18@example.com', 01818181818, 18, 'Dhaka Division'),
(19, 'Sajib Chowdhury', 'Assistant Sub-Inspector', 'sajib.officer19@example.com', 01819191919, 19, 'Dhaka Division'),
(20, 'Rina Akter', 'Sub-Inspector', 'rina.officer20@example.com', 01820202020, 20, 'Dhaka Division'),
(21, 'Jamal Uddin', 'Inspector', 'jamal.officer21@example.com', 01821212121, 21, 'Dhaka Division'),
(22, 'Mim Rashid', 'Assistant Sub-Inspector', 'mim.officer22@example.com', 01822222222, 22, 'Dhaka Division'),
(23, 'Nasir Ahmed', 'Sub-Inspector', 'nasir.officer23@example.com', 01823232323, 23, 'Dhaka Division'),
(24, 'Sharmin Sultana', 'Inspector', 'sharmin.officer24@example.com', 01824242424, 24, 'Dhaka Division'),
(25, 'Fahim Islam', 'Assistant Sub-Inspector', 'fahim.officer25@example.com', 01825252525, 25, 'Dhaka Division'),
(26, 'Sultana Parvin', 'Sub-Inspector', 'sultana.officer26@example.com', 1826262626, 26, 'Dhaka Division'),
(27, 'Riyad Hasan', 'Inspector', 'riyad.officer27@example.com', 01827272727, 27, 'Dhaka Division'),
(28, 'Nazma Akhter', 'Assistant Sub-Inspector', 'nazma.officer28@example.com', 01828282828, 28, 'Dhaka Division'),
(29, 'Habiba Khatun', 'Sub-Inspector', 'habiba.officer29@example.com', 01829292929, 29, 'Dhaka Division'),
(30, 'Sabbir Hossain', 'Inspector', 'sabbir.officer30@example.com', 01830303030, 30, 'Dhaka Division');

UPDATE Officer SET phone = '01711111111' WHERE officer_id = 1;
UPDATE Officer SET phone = '01722222222' WHERE officer_id = 2;
UPDATE Officer SET phone = '01733333333' WHERE officer_id = 3;
UPDATE Officer SET phone = '01744444444' WHERE officer_id = 4;
UPDATE Officer SET phone = '01755555555' WHERE officer_id = 5;
UPDATE Officer SET phone = '01766666666' WHERE officer_id = 6;
UPDATE Officer SET phone = '01777777777' WHERE officer_id = 7;
UPDATE Officer SET phone = '01788888888' WHERE officer_id = 8;
UPDATE Officer SET phone = '01799999999' WHERE officer_id = 9;
UPDATE Officer SET phone = '01810101010' WHERE officer_id = 10;
UPDATE Officer SET phone = '01811111112' WHERE officer_id = 11;
UPDATE Officer SET phone = '01812121212' WHERE officer_id = 12;
UPDATE Officer SET phone = '01813131313' WHERE officer_id = 13;
UPDATE Officer SET phone = '01814141414' WHERE officer_id = 14;
UPDATE Officer SET phone = '01815151515' WHERE officer_id = 15;
UPDATE Officer SET phone = '01816161616' WHERE officer_id = 16;
UPDATE Officer SET phone = '01817171717' WHERE officer_id = 17;
UPDATE Officer SET phone = '01818181818' WHERE officer_id = 18;
UPDATE Officer SET phone = '01819191919' WHERE officer_id = 19;
UPDATE Officer SET phone = '01820202020' WHERE officer_id = 20;
UPDATE Officer SET phone = '01821212121' WHERE officer_id = 21;
UPDATE Officer SET phone = '01822222222' WHERE officer_id = 22;
UPDATE Officer SET phone = '01823232323' WHERE officer_id = 23;
UPDATE Officer SET phone = '01824242424' WHERE officer_id = 24;
UPDATE Officer SET phone = '01825252525' WHERE officer_id = 25;
UPDATE Officer SET phone = '01826262626' WHERE officer_id = 26;
UPDATE Officer SET phone = '01827272727' WHERE officer_id = 27;
UPDATE Officer SET phone = '01828282828' WHERE officer_id = 28;
UPDATE Officer SET phone = '01829292929' WHERE officer_id = 29;
UPDATE Officer SET phone = '01830303030' WHERE officer_id = 30;

SELECT * FROM Officer;


-- Step 6: Create the Makes_complaint table
CREATE TABLE Makes_complaint (
    complaint_id INT PRIMARY KEY,
    description VARCHAR(255),
    date DATE,
    acknowledgment_id INT,
    status VARCHAR(50),
    victim_id INT,
    thana_id INT,
    FOREIGN KEY (victim_id) REFERENCES Victim(victim_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (thana_id) REFERENCES Thana(thana_id)
        ON DELETE CASCADE ON UPDATE CASCADE);
        
ALTER TABLE Makes_complaint
DROP FOREIGN KEY makes_complaint_ibfk_3;

ALTER TABLE crime_detection
DROP PRIMARY KEY;

ALTER TABLE crime_detection
ADD COLUMN crime_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;

ALTER TABLE Makes_complaint
DROP COLUMN crime_type,  -- only if safe to delete
ADD COLUMN crime_id INT;

ALTER TABLE Makes_complaint
ADD CONSTRAINT fk_crime
FOREIGN KEY (crime_id) REFERENCES crime_detection(crime_id)
ON DELETE CASCADE ON UPDATE CASCADE;







-- Step 7: Create the Case_filing table
CREATE TABLE Case_filing (
    case_id INT PRIMARY KEY,
    summary VARCHAR(255),
    status VARCHAR(50),
    start_date DATE,
    end_date DATE,
    complaint_id INT,
    officer_id INT,
    thana_id INT,
    FOREIGN KEY (complaint_id) REFERENCES Makes_complaint(complaint_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (officer_id) REFERENCES Officer(officer_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (thana_id) REFERENCES Thana(thana_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);


-- Step 8: Create the Case_handover_log table
CREATE TABLE Case_handover_log (
    log_id INT PRIMARY KEY,
    case_id INT,
    date DATE,
    officer_id INT,
    remarks VARCHAR(255),
    FOREIGN KEY (case_id) REFERENCES Case_filing(case_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (officer_id) REFERENCES Officer(officer_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
SHOW TABLES;

--  for ensuring unique ids:
-- step-1: add UUID column:
ALTER TABLE Victim ADD COLUMN new_victim_id CHAR(36);
ALTER TABLE Makes_complaint ADD COLUMN new_complaint_id CHAR(36);
ALTER TABLE Case_filing ADD COLUMN new_case_id CHAR(36);
ALTER TABLE Case_handover_log ADD COLUMN new_log_id CHAR(36);
ALTER TABLE Thana ADD COLUMN new_thana_id CHAR(36);
ALTER TABLE Officer ADD COLUMN new_officer_id CHAR(36);
ALTER TABLE Crime_detection ADD COLUMN new_crime_id CHAR(36);

-- Step 2: Assign UUIDs for victim table:
UPDATE Victim SET new_victim_id = UUID();

-- Step 3: Update foreign key in Makes_complaint
ALTER TABLE Makes_complaint ADD COLUMN new_victim_id CHAR(36);
UPDATE Makes_complaint mc
JOIN Victim v ON mc.victim_id = v.victim_id
SET mc.new_victim_id = v.new_victim_id;

-- Drop old PK and replace
ALTER TABLE Victim DROP PRIMARY KEY;
ALTER TABLE Victim DROP COLUMN victim_id;
ALTER TABLE Victim CHANGE new_victim_id victim_id CHAR(36) PRIMARY KEY;
-- Also update FK in Makes_complaint
ALTER TABLE Makes_complaint DROP FOREIGN KEY makes_complaint_ibfk_victim;
ALTER TABLE Makes_complaint DROP COLUMN victim_id;
ALTER TABLE Makes_complaint CHANGE new_victim_id victim_id CHAR(36);
ALTER TABLE Makes_complaint 
ADD CONSTRAINT fk_makes_complaint_victim FOREIGN KEY (victim_id) REFERENCES Victim(victim_id) ON DELETE CASCADE ON UPDATE CASCADE;

-- for Makes_complaint table:

-- step-1:
ALTER TABLE Makes_complaint ADD COLUMN new_complaint_id CHAR(36);
-- step-2:
UPDATE Makes_complaint SET new_complaint_id = UUID();
-- step-3:
ALTER TABLE Case_filing ADD COLUMN new_complaint_id CHAR(36);

UPDATE Case_filing cf
JOIN Makes_complaint mc ON cf.complaint_id = mc.complaint_id
SET cf.new_complaint_id = mc.new_complaint_id;
-- step-4:
ALTER TABLE Makes_complaint DROP PRIMARY KEY;
ALTER TABLE Makes_complaint DROP COLUMN complaint_id;
ALTER TABLE Makes_complaint CHANGE new_complaint_id complaint_id CHAR(36) PRIMARY KEY;
-- FK update in Case_filing
ALTER TABLE Case_filing DROP FOREIGN KEY case_filing_ibfk_complaint;
ALTER TABLE Case_filing DROP COLUMN complaint_id;
ALTER TABLE Case_filing CHANGE new_complaint_id complaint_id CHAR(36);
ALTER TABLE Case_filing 
ADD CONSTRAINT fk_case_filing_complaint FOREIGN KEY (complaint_id) REFERENCES Makes_complaint(complaint_id) ON DELETE CASCADE ON UPDATE CASCADE;

 



