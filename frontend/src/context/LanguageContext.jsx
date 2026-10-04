import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Brand
    brand_sub: 'Medical Network',
    brand_donor_sub: 'Donor Network',
    brand_patient_sub: 'Patient Care',

    // Navigation
    nav_home: 'Home',
    nav_donor_portal: 'My Donor Portal',
    nav_patients_need: 'Patients In Need',
    nav_patient_portal: 'My Patient Portal',
    nav_find_donors: 'Find Donors',
    nav_sos_btn: '10s SOS Blood',
    nav_emergency: 'Emergency',
    nav_contact: 'Contact Us',
    nav_login: 'Login',
    nav_register: 'Register',
    nav_signout: 'Sign Out',
    nav_admin: 'Admin Console',

    // Mobile Bottom Nav
    mob_home: 'Home',
    mob_patients: 'Patients',
    mob_donors: 'Donors',
    mob_sos: '10s SOS',
    mob_my_portal: 'My Portal',
    mob_support: 'Support',
    mob_urgent: 'Urgent',
    mob_signin: 'Sign In',

    // Common Actions
    btn_call_now: 'Call Now',
    btn_call_donor: 'Call Donor',
    btn_whatsapp: 'WhatsApp',
    btn_directions: 'Hospital Directions',
    btn_chat: 'Direct Chat',
    btn_portal_chat: 'Portal Chat',
    btn_search: 'Search',
    btn_view_map: 'Live Radar Map',
    btn_view_grid: 'Directory Cards',
    btn_broadcast_whatsapp: 'Broadcast on WhatsApp',
    btn_copy_link: 'Copy Link',
    btn_share_sos: 'Share SOS Alert',
    btn_close: 'Close',
    btn_cancel: 'Cancel',
    btn_submit: 'Submit',

    // Status & Badges
    status_available: 'Available to Donate',
    status_resting: 'Temporarily Resting',
    badge_verified: 'Verified Lifesaver',
    badge_critical: 'Critical',
    badge_high: 'High Urgency',
    badge_moderate: 'Urgent',
    badge_units: 'Units Needed',
    badge_donations: 'Donations Given',

    // Hero Section & Slides
    hero_badge_1: 'HEROES AMONG US',
    hero_title_1: 'Save Lives Today',
    hero_sub_1: 'One blood donation can save up to 3 lives. Be a hero for someone in need.',
    hero_stat_1: '1,250+ Active Donors Ready',
    hero_cta_1: 'Become a Donor',
    hero_badge_2: 'RAPID EMERGENCY RESPONSE',
    hero_title_2: 'Connected in Minutes',
    hero_sub_2: 'Connecting families in distress with verified donors in your exact city.',
    hero_stat_2: '2.3 min Avg Match Time',
    hero_cta_2: 'Find Blood Urgently',
    hero_badge_3: 'COMMUNITY MOVEMENT',
    hero_title_3: '18,000+ Lifesavers',
    hero_sub_3: 'A passionate nationwide network standing ready 24/7 for critical emergencies.',
    hero_stat_3: '98% Emergency Fulfillment',
    hero_cta_3: 'Join Our Community',
    hero_badge_4: 'DIRECT LIFE CONNECTION',
    hero_title_4: 'Every Drop Counts',
    hero_sub_4: 'Direct hospital dispatch and peer-to-peer blood donation without middlemen.',
    hero_stat_4: '2,840+ Lives Saved',
    hero_cta_4: 'Check Compatibility',
    hero_search_title: 'Instant Blood Donor Radar',
    hero_search_group: 'Required Group',
    hero_search_city: 'City (e.g. Lahore, Mardan)',
    hero_search_btn: 'Find Donors Now',
    hero_search_sos: 'Or Post 10s SOS Alert',
    hero_live_ticker: 'Live Emergency Feed',

    // Impact & Stats
    stats_title: 'Our Impact',
    stats_subtitle: 'Empowering communities and giving patients the emergency support they need when every second counts.',
    stat_success_rate: 'Success Rate',
    stat_success_sub: 'Critical requests fulfilled',
    stat_emergency_support: 'Emergency Support',
    stat_emergency_sub: 'Always available team',
    stat_active_donors: 'Active Donors',
    stat_active_sub: 'Verified life-savers',
    stat_lives_saved: 'Lives Saved',
    stat_lives_sub: 'Community impact',

    // Why LifeLink
    why_title: 'Why LifeLink?',
    why_text: 'In urgent times, people often send messages in WhatsApp groups and social media, desperately searching for blood donors. LifeLink makes this process easier, faster, and more reliable. With just a few clicks, you can connect with donors or patients in need—no more waiting, no more uncertainty.',
    why_highlight: 'Save lives, spread hope, and be a hero in your community!',

    // Patients Carousel
    pat_carousel_badge: 'LIVE HOSPITAL BROADCAST',
    pat_carousel_title: 'Critical Patients Needing Blood',
    pat_case: 'Case',
    pat_of: 'of',
    pat_autorefresh: 'Auto-refreshing',
    pat_needed: 'Required Group',
    pat_units: 'Units Needed',
    pat_hospital: 'Hospital & Location',
    pat_contact: 'Emergency Contact',
    pat_empty_title: 'LifeLink Emergency Network Active',
    pat_empty_desc: 'All recent emergency blood requests have verified donors responding. In case of an urgent need at any hospital, post an SOS alert immediately.',

    // Donors Page
    donors_title: 'Verified Blood Donors',
    donors_subtitle: 'Connect directly with volunteer blood donors across Pakistan ready to save lives.',
    donors_available_only: 'Available Donors Only',
    donors_view_map: 'Live Radar Map',
    donors_view_grid: 'Directory Cards',
    donors_city_placeholder: 'Search by city (e.g. Lahore, Mardan)',
    donors_filter_btn: 'Filter',
    donors_no_results: 'No donors found',
    donors_no_results_sub: 'Try adjusting your blood group or city filters',
    donors_total_donations: 'Donations',
    donors_last_donated: 'Last Donated',
    donors_age: 'Age',
    donors_role_notice: 'Volunteer Donor View',

    // Donor Dashboard
    donor_welcome: 'Welcome back',
    donor_subtitle: 'Your personal donor hub. Keep your availability updated so hospitals and coordinators can reach you during critical moments.',
    donor_cta_title: 'Looking to Respond to Hospital Emergencies?',
    donor_cta_desc: 'Explore the nationwide Patients In Need board. Filter by your blood group or city to connect with families and hospital blood banks right now.',
    donor_cta_btn: 'Open Patients In Need',
    donor_hadith_badge: 'Spiritual Virtues of Blood Donation',
    donor_hadith_title: 'The Divine Honor of Donating Blood in Islam',
    donor_readiness_title: 'Donor Health Readiness Checklist',
    donor_compat_title: 'Blood Group Compatibility',
    donor_log_btn: 'Log a Donation',
    donor_profile_title: 'Donor Profile & Status',
    donor_status_toggle: 'Toggle Availability',
    donor_available_msg: 'You are currently marked as AVAILABLE. Hospitals and patients can contact you in emergencies.',
    donor_resting_msg: 'You are currently marked as RESTING. You will not receive urgent emergency calls.',
    donor_total_donations_badge: 'Total Donations Given',
    donor_log_modal_title: 'Log a Completed Blood Donation',
    donor_log_hospital_label: 'Hospital or Blood Bank Name *',
    donor_log_date_label: 'Donation Date *',
    donor_log_notes_label: 'Notes (Optional)',
    donor_log_save_btn: 'Save to Donation History',
    donor_compat_can_donate: 'Can Donate To:',
    donor_compat_can_receive: 'Can Receive From:',

    // Patient Dashboard
    patient_dash_title: 'Patient Blood Request Hub',
    patient_dash_subtitle: 'Monitor active emergency alerts, track responding donors, and post urgent requirements.',
    patient_post_btn: 'Post Urgent Blood SOS',
    patient_my_requests: 'My Emergency Requests',
    patient_no_requests: 'You have no active emergency requests posted yet.',
    patient_matching_donors: 'Available Donors Ready Near You',

    // Emergency & Patients
    sos_broadcast_title: 'Real-Time Hospital SOS Broadcast',
    sos_broadcast_subtitle: 'Urgent blood transfusions needed right now across Pakistan',
    filter_all_blood: 'All Blood Types',
    filter_city_placeholder: 'Filter city (e.g. Lahore, Mardan)',
    post_emergency_btn: 'Post Emergency SOS',

    // Contact Us Page
    contact_badge: 'Get in Touch',
    contact_title: 'Contact LifeLink',
    contact_subtitle: "We'd love to hear your feedback, hospital partnership inquiries, or emergency coordination questions.",
    contact_hotlines_title: 'Emergency Hotlines',
    contact_hotlines_sub: 'For immediate critical blood needs or hospital dispatch, contact our rapid coordination center directly:',
    contact_helpline_label: 'Priority 24/7 Helpline',
    contact_email_label: 'Official Email',
    contact_hq_label: 'Central Operations',
    contact_hq_val: 'Shergarh, Mardan',
    contact_form_title: 'Send Us a Message',
    contact_form_name: 'Your Full Name *',
    contact_form_email: 'Your Email Address *',
    contact_form_subject: 'Subject',
    contact_form_message: 'Message Details *',
    contact_form_submit: 'Send Message',
    contact_form_success: 'Thank you! Your message has been sent to our coordination team.',

    // Footer
    footer_news_title: 'Be The First To Know When A Life Is In Need',
    footer_news_desc: 'Subscribe for instant urgent blood donor calls in your hospital area. Zero spam, 100% life-saving priority alerts.',
    footer_news_placeholder: 'Enter your email address',
    footer_news_btn: 'Subscribe',
    footer_news_success: 'You are enrolled in emergency community notifications!',
    footer_compat_title: 'Blood Group Quick Reference Matrix',
    footer_compat_sub: 'Click any blood group to jump to donor search',
    footer_about_title: 'About LifeLink',
    footer_about_desc: "Pakistan's premier rapid-response emergency blood donation network connecting patients directly with verified volunteer donors.",
    footer_quick_links: 'Quick Links',
    footer_legal: 'Community initiative dedicated to saving human lives. Free & non-commercial.',
    footer_rights: 'All rights reserved.',

    // Auth Forms
    auth_login_title: 'Sign in to LifeLink',
    auth_register_title: 'Create Your LifeLink Account',
    auth_i_am_donor: 'I am a Blood Donor',
    auth_i_am_patient: 'I am a Patient / Attendant',
    auth_email: 'Email Address',
    auth_password: 'Password',
    auth_name: 'Full Name',
    auth_phone: 'Phone Number',
    auth_blood_group: 'Blood Group',
    auth_city: 'City',
    auth_age: 'Age',
    auth_submit_login: 'Sign In',
    auth_submit_register: 'Register Now',
    auth_no_account: "Don't have an account? Register",
    auth_has_account: 'Already have an account? Sign In',

    // WhatsApp Message Templates
    wa_sos_header: '🚨 *URGENT BLOOD REQUIRED — LIFELINK EMERGENCY SOS*',
    wa_patient: '👤 *Patient:*',
    wa_blood_needed: '🩸 *Required Blood Group:*',
    wa_units: '📦 *Units Needed:*',
    wa_hospital: '🏥 *Hospital:*',
    wa_city: '📍 *City:*',
    wa_contact: '📞 *Direct Urgent Contact:*',
    wa_respond_link: '👉 *Open on LifeLink & Respond Immediately:*',
    wa_footer: '_Whoever saves one life, it is as if he had saved mankind entirely. Please share in your groups!_'
  },

  ur: {
    // Brand
    brand_sub: 'میڈیکل نیٹ ورک',
    brand_donor_sub: 'ڈونر نیٹ ورک',
    brand_patient_sub: 'مریض نگہداشت',

    // Navigation
    nav_home: 'ہوم',
    nav_donor_portal: 'میرا ڈونر پورٹل',
    nav_patients_need: 'ضرورت مند مریض',
    nav_patient_portal: 'میرا مریض پورٹل',
    nav_find_donors: 'ڈونرز تلاش کریں',
    nav_sos_btn: '۱۰ سیکنڈ فوری خون',
    nav_emergency: 'ایمرجنسی',
    nav_contact: 'رابطہ کریں',
    nav_login: 'لاگ ان',
    nav_register: 'رجسٹر',
    nav_signout: 'سائن آؤٹ',
    nav_admin: 'ایڈمن کنسول',

    // Mobile Bottom Nav
    mob_home: 'ہوم',
    mob_patients: 'مریض',
    mob_donors: 'ڈونرز',
    mob_sos: 'فوری خون',
    mob_my_portal: 'میرا پورٹل',
    mob_support: 'رابطہ',
    mob_urgent: 'فوری ضرورت',
    mob_signin: 'سائن ان',

    // Common Actions
    btn_call_now: 'کال کریں',
    btn_call_donor: 'ڈونر کو کال کریں',
    btn_whatsapp: 'واٹس ایپ',
    btn_directions: 'ہسپتال کا راستہ',
    btn_chat: 'براہِ راست چیٹ',
    btn_portal_chat: 'پورٹل چیٹ',
    btn_search: 'تلاش کریں',
    btn_view_map: 'لائیو ریڈار نقشہ',
    btn_view_grid: 'ڈائریکٹری فہرست',
    btn_broadcast_whatsapp: 'واٹس ایپ پر شیئر کریں',
    btn_copy_link: 'لنک کاپی کریں',
    btn_share_sos: 'ایمرجنسی شیئر کریں',
    btn_close: 'بند کریں',
    btn_cancel: 'منسوخ کریں',
    btn_submit: 'جمع کرائیں',

    // Status & Badges
    status_available: 'خون دینے کیلئے دستیاب',
    status_resting: 'عارضی آرام پر',
    badge_verified: 'تصدیق شدہ لائف سیور',
    badge_critical: 'انتہائی نازک',
    badge_high: 'فوری ضرورت',
    badge_moderate: 'ضروری',
    badge_units: 'بوتلیں درکار ہیں',
    badge_donations: 'عطیات دیے',

    // Hero Section & Slides
    hero_badge_1: 'ہمارے درمیان ہیروز',
    hero_title_1: 'آج ہی زندگیاں بچائیں',
    hero_sub_1: 'خون کا ایک عطیہ ۳ زندگیاں بچا سکتا ہے۔ ضرورت مند کے لیے امید بنیں۔',
    hero_stat_1: '۱۲۵۰+ فعال ڈونرز تیار',
    hero_cta_1: 'ڈونر بنیں',
    hero_badge_2: 'فوری ہنگامی ردعمل',
    hero_title_2: 'منٹوں میں رابطہ',
    hero_sub_2: 'پریشان حال خاندانوں کو اپنے ہی شہر میں تصدیق شدہ ڈونرز سے جوڑیں۔',
    hero_stat_2: '۲.۳ منٹ اوسط رابطہ وقت',
    hero_cta_2: 'خون فوری تلاش کریں',
    hero_badge_3: 'عوامی تحریک',
    hero_title_3: '۱۸,۰۰۰+ محافظِ حیات',
    hero_sub_3: 'ملک بھر میں ۲۴ گھنٹے ایمرجنسی کے لیے تیار پرعزم نیٹ ورک۔',
    hero_stat_3: '۹۸٪ ایمرجنسی تکمیل',
    hero_cta_3: 'کمیونٹی میں شامل ہوں',
    hero_badge_4: 'براہِ راست زندگی کا تعلق',
    hero_title_4: 'ہر قطرہ قیمتی ہے',
    hero_sub_4: 'بغیر کسی درمیانی واسطے کے ہسپتالوں میں براہِ راست خون کی ترسیل۔',
    hero_stat_4: '۲۸۴۰+ محفوظ زندگیاں',
    hero_cta_4: 'مطابقت چیک کریں',
    hero_search_title: 'فوری بلڈ ڈونر ریڈار',
    hero_search_group: 'مطلوبہ بلڈ گروپ',
    hero_search_city: 'شہر درج کریں (مثلاً لاہور، مردان)',
    hero_search_btn: 'ابھی ڈونرز تلاش کریں',
    hero_search_sos: 'یا ۱۰ سیکنڈ فوری SOS الرٹ بھیجیں',
    hero_live_ticker: 'لائیو ایمرجنسی الرٹس',

    // Impact & Stats
    stats_title: 'ہمارے اثرات و کامیابیاں',
    stats_subtitle: 'کمیونٹیز کو بااختیار بنانا اور مریضوں کو نازک لمحات میں فوری مدد فراہم کرنا۔',
    stat_success_rate: 'کامیابی کی شرح',
    stat_success_sub: 'نازک کیسز کی کامیاب تکمیل',
    stat_emergency_support: 'ہنگامی مدد',
    stat_emergency_sub: 'ہمہ وقت حاضر و الرٹ ٹیم',
    stat_active_donors: 'فعال ڈونرز',
    stat_active_sub: 'تصدیق شدہ لائف سیورز',
    stat_lives_saved: 'محفوظ زندگیاں',
    stat_lives_sub: 'معاشرتی اثرات',

    // Why LifeLink
    why_title: 'لائف لنک کیوں؟',
    why_text: 'ایمرجنسی میں لوگ واٹس ایپ اور سوشل میڈیا پر پیغامات بھیجتے ہیں، خون کے عطیہ دہندگان کی تلاش میں۔ LifeLink اس عمل کو آسان، تیز اور قابلِ اعتماد بناتا ہے۔ صرف چند کلکس میں آپ ضرورت مند مریض یا عطیہ دہندگان سے جڑ سکتے ہیں۔ اب انتظار نہیں، اب بے یقینی نہیں۔',
    why_highlight: 'زندگیاں بچائیں، امید پھیلائیں، اور اپنے معاشرے کے ہیرو بنیں!',

    // Patients Carousel
    pat_carousel_badge: 'ہسپتالوں کی لائیو براڈکاسٹ',
    pat_carousel_title: 'خون کے فوری ضرورت مند مریض',
    pat_case: 'کیس نمبر',
    pat_of: 'از',
    pat_autorefresh: 'خودکار اپ ڈیٹ',
    pat_needed: 'مطلوبہ گروپ',
    pat_units: 'درکار بوتلیں',
    pat_hospital: 'ہسپتال و وارڈ',
    pat_contact: 'ایمرجنسی رابطہ',
    pat_empty_title: 'لائف لنک ایمرجنسی نیٹ ورک الرٹ ہے',
    pat_empty_desc: 'حالیہ تمام ایمرجنسی کیسز پر ڈونرز کا رسپانس جاری ہے۔ اگر کسی ہسپتال میں خون درکار ہو تو فوری SOS پوسٹ کریں۔',

    // Donors Page
    donors_title: 'تصدیق شدہ بلڈ ڈونرز',
    donors_subtitle: 'پاکستان بھر میں رضاکار بلڈ ڈونرز سے براہِ راست رابطہ کریں جو جانیں بچانے کیلئے تیار ہیں۔',
    donors_available_only: 'صرف دستیاب ڈونرز',
    donors_view_map: 'لائیو ریڈار نقشہ',
    donors_view_grid: 'ڈائریکٹری فہرست',
    donors_city_placeholder: 'شہر کے ذریعے تلاش کریں (مثلاً لاہور، مردان)',
    donors_filter_btn: 'فلٹر کریں',
    donors_no_results: 'کوئی ڈونر نہیں ملا',
    donors_no_results_sub: 'بلڈ گروپ یا شہر تبدیل کر کے دوبارہ کوشش کریں',
    donors_total_donations: 'عطیات دیے',
    donors_last_donated: 'آخری عطیہ',
    donors_age: 'عمر',
    donors_role_notice: 'رضاکار ڈونر ویو',

    // Donor Dashboard
    donor_welcome: 'خوش آمدید',
    donor_subtitle: 'آپ کا ذاتی ڈونر پورٹل۔ اپنی دستیابی اپ ڈیٹ رکھیں تاکہ ایمرجنسی میں ہسپتال اور مریض آپ سے فوری رابطہ کر سکیں۔',
    donor_cta_title: 'کیا آپ ہسپتال ایمرجنسی میں کسی کی جان بچانا چاہتے ہیں؟',
    donor_cta_desc: 'ملک بھر کے ضرورت مند مریضوں کا براڈکاسٹ بورڈ دیکھیں۔ اپنے بلڈ گروپ یا شہر کے مطابق فلٹر کر کے فوری رابطہ کریں۔',
    donor_cta_btn: 'ضرورت مند مریض دیکھیں',
    donor_hadith_badge: 'خون کے عطیہ کے فضائل و برکات',
    donor_hadith_title: 'اسلام میں خون کا عطیہ دینے کا عظیم اجر',
    donor_readiness_title: 'خون دینے سے قبل صحت کا جائزہ',
    donor_compat_title: 'بلڈ گروپ کی مطابقت',
    donor_log_btn: 'عطیہ درج کریں',
    donor_profile_title: 'ڈونر پروفائل اور کیفیت',
    donor_status_toggle: 'دستیابی تبدیل کریں',
    donor_available_msg: 'آپ فی الحال دستیاب ہیں۔ ہسپتال اور مریض ایمرجنسی میں آپ سے رابطہ کر سکتے ہیں۔',
    donor_resting_msg: 'آپ فی الحال آرام پر ہیں۔ آپ کو ہنگامی کالز موصول نہیں ہوں گی۔',
    donor_total_donations_badge: 'کل دیے گئے عطیات',
    donor_log_modal_title: 'مکمل شدہ عطیہ درج کریں',
    donor_log_hospital_label: 'ہسپتال یا بلڈ بینک کا نام *',
    donor_log_date_label: 'عطیہ کی تاریخ *',
    donor_log_notes_label: 'نوٹس (اختیاری)',
    donor_log_save_btn: 'عطیہ کی تاریخ میں محفوظ کریں',
    donor_compat_can_donate: 'خون دے سکتے ہیں:',
    donor_compat_can_receive: 'خون لے سکتے ہیں:',

    // Patient Dashboard
    patient_dash_title: 'مریض بلڈ ریکویسٹ پورٹل',
    patient_dash_subtitle: 'اپنے فعال کیسز کی نگرانی کریں، جواب دینے والے ڈونرز دیکھیں اور فوری ضرورت پوسٹ کریں۔',
    patient_post_btn: 'فوری خون کا SOS پوسٹ کریں',
    patient_my_requests: 'میری ہنگامی درخواستیں',
    patient_no_requests: 'آپ کی طرف سے فی الحال کوئی فعال ایمرجنسی درخواست درج نہیں ہے۔',
    patient_matching_donors: 'آپ کے قریب دستیاب ڈونرز',

    // Emergency & Patients
    sos_broadcast_title: 'ہسپتالوں کی لائیو ایمرجنسی براڈکاسٹ',
    sos_broadcast_subtitle: 'اس وقت پاکستان بھر کے ہسپتالوں میں خون کی فوری ضرورت ہے',
    filter_all_blood: 'تمام بلڈ گروپس',
    filter_city_placeholder: 'شہر منتخب کریں (مثلاً پشاور، مردان، لاہور)',
    post_emergency_btn: 'ایمرجنسی درخواست پوسٹ کریں',

    // Contact Us Page
    contact_badge: 'ہم سے رابطہ کریں',
    contact_title: 'لائف لنک سے رابطہ کریں',
    contact_subtitle: 'ہمیں آپ کی تجاویز، ہسپتالوں کے الحاق یا ایمرجنسی رابطہ کیلئے سن کر خوشی ہوگی۔',
    contact_hotlines_title: 'ہنگامی رابطہ لائنز',
    contact_hotlines_sub: 'خون کی فوری ضرورت یا ہسپتال ترسیل کیلئے ہمارے سنٹر سے براہِ راست رابطہ کریں:',
    contact_helpline_label: '۲۴ گھنٹے ترجیحی ہیلپ لائن',
    contact_email_label: 'سرکاری ای میل',
    contact_hq_label: 'مرکزی رابطہ دفتر',
    contact_hq_val: 'شیرگڑھ، مردان',
    contact_form_title: 'ہمیں پیغام بھیجیں',
    contact_form_name: 'آپ کا مکمل نام *',
    contact_form_email: 'آپ کا ای میل ایڈریس *',
    contact_form_subject: 'موضوع',
    contact_form_message: 'پیغام کی تفصیلات *',
    contact_form_submit: 'پیغام بھیجیں',
    contact_form_success: 'شکریہ! آپ کا پیغام ہماری کوآرڈینیشن ٹیم کو موصول ہو گیا ہے۔',

    // Footer
    footer_news_title: 'جب کسی کو خون کی ضرورت ہو، سب سے پہلے باخبر رہیں',
    footer_news_desc: 'اپنے قریبی ہسپتالوں میں خون کی ایمرجنسی کالز موصول کرنے کیلئے سبسکرائب کریں۔ ۱۰۰٪ مفت اور محفوظ۔',
    footer_news_placeholder: 'اپنا ای میل ایڈریس درج کریں',
    footer_news_btn: 'سبسکرائب کریں',
    footer_news_success: 'آپ ایمرجنسی اطلاعات کیلئے کامیابی سے رجسٹر ہو گئے ہیں!',
    footer_compat_title: 'بلڈ گروپ فوری مطابقت چارٹ',
    footer_compat_sub: 'ڈونر تلاش کرنے کیلئے کسی بھی بلڈ گروپ پر کلک کریں',
    footer_about_title: 'لائف لنک کے بارے میں',
    footer_about_desc: 'پاکستان کا اولین فوری ہنگامی بلڈ ڈونیشن نیٹ ورک جو مریضوں کو براہِ راست تصدیق شدہ رضاکاروں سے جوڑتا ہے۔',
    footer_quick_links: 'اہم لنکس',
    footer_legal: 'انسانی جانیں بچانے کیلئے ایک عوامی و فلاحی خدمت۔ مکمل طور پر غیر تجارتی۔',
    footer_rights: 'جملہ حقوق محفوظ ہیں۔',

    // Auth Forms
    auth_login_title: 'لائف لنک میں سائن ان کریں',
    auth_register_title: 'اپنا لائف لنک اکاؤنٹ بنائیں',
    auth_i_am_donor: 'میں خون کا عطیہ دہندہ (ڈونر) ہوں',
    auth_i_am_patient: 'میں مریض / تیماردار ہوں',
    auth_email: 'ای میل ایڈریس',
    auth_password: 'پاس ورڈ',
    auth_name: 'مکمل نام',
    auth_phone: 'موبائل نمبر',
    auth_blood_group: 'بلڈ گروپ',
    auth_city: 'شہر',
    auth_age: 'عمر',
    auth_submit_login: 'سائن ان کریں',
    auth_submit_register: 'ابھی رجسٹر کریں',
    auth_no_account: 'اکاؤنٹ نہیں ہے؟ نیا اکاؤنٹ بنائیں',
    auth_has_account: 'پہلے سے اکاؤنٹ موجود ہے؟ سائن ان کریں',

    // WhatsApp Message Templates
    wa_sos_header: '🚨 *خون کی فوری ضرورت ہے — لائف لنک ایمرجنسی SOS*',
    wa_patient: '👤 *مریض کا نام:*',
    wa_blood_needed: '🩸 *مطلوبہ بلڈ گروپ:*',
    wa_units: '📦 *کتنی بوتلیں درکار ہیں:*',
    wa_hospital: '🏥 *ہسپتال:*',
    wa_city: '📍 *شہر:*',
    wa_contact: '📞 *فوری رابطہ نمبر:*',
    wa_respond_link: '👉 *لائف لنک پر کھولیں اور فوری مدد کریں:*',
    wa_footer: '«جس نے ایک جان کو بچایا، گویا اس نے پوری انسانیت کو بچایا۔» برائے مہربانی واٹس ایپ گروپس میں شیئر کریں!'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('lifelink_lang') || 'en';
  });

  const isUrdu = language === 'ur';

  useEffect(() => {
    localStorage.setItem('lifelink_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = isUrdu ? 'rtl' : 'ltr';
    
    // Toggle Urdu font helper class on body
    if (isUrdu) {
      document.body.classList.add('lang-urdu');
    } else {
      document.body.classList.remove('lang-urdu');
    }
  }, [language, isUrdu]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ur' : 'en'));
  };

  const t = (key, fallback = '') => {
    const langDict = translations[language] || translations.en;
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    return translations.en[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, isUrdu, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
