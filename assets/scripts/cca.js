// ---------------------------------------------------------------------------
// CCA data — sourced from https://www.sp.edu.sg/student-life/ccas
// category: "constituent" | "arts" | "service" | "special" | "sports"
// waterSport / soc are extra tags used by the quick-filter checkboxes
// img: path to a photo in your assets/images/CCA/<Category>/ folders
// url: the club's official SP page (used as the "Sign up" fallback link)
// instagram: verified Instagram handle, shown as a quick-contact icon
//   when known — only filled in for clubs confirmed via each club's own
//   "Contact Us" section on sp.edu.sg. Not every club has these yet; the
//   Sign up link is always shown so every club stays reachable regardless.
// ---------------------------------------------------------------------------
const CCA_DATA = [

  // Constituent Clubs
  { name: "School of Architecture & the Built Environment Club", category: "constituent", img: "assets/images/CCA/Constituent/abe.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/constituent-clubs/architecture-and-the-built-environment-club", instagram: "spabeclub", desc: "Represents ABE students and organises school-wide events and activities." },
  { name: "School of Chemical & Life Sciences Club", category: "constituent", img: "assets/images/CCA/Constituent/cls.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/constituent-clubs/chemical-life-sciences-club", instagram: "sp_cls", desc: "Represents CLS students and organises school-wide events and activities." },
  { name: "School of Electrical & Electronic Engineering Club", category: "constituent", img: "assets/images/CCA/Constituent/eee.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/constituent-clubs/electrical-electronic-engineering-club", instagram: "sp_eeec", desc: "Represents EEE students and organises school-wide events and activities." },
  { name: "School of Mechanical & Aeronautical Engineering Club", category: "constituent", img: "assets/images/CCA/Constituent/mae.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/constituent-clubs/mechanical-aeronautical-engineering-club", desc: "Represents MAE students and organises school-wide events and activities." },
  { name: "Media, Arts & Design School Club", category: "constituent", img: "assets/images/CCA/Constituent/mad.png", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/constituent-clubs/media-arts-design-school-club", desc: "Represents MAD students and organises school-wide events and activities." },
  { name: "School of Business Club", category: "constituent", img: "assets/images/CCA/Constituent/sob.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/constituent-clubs/school-of-business-club", desc: "Represents SB students and organises school-wide events and activities." },
  { name: "School of Computing Club", category: "constituent", soc: true, img: "assets/images/CCA/Constituent/soc.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/constituent-clubs/school-of-computing-club", instagram: "spsocclub", desc: "Represents SOC students and organises school-wide events and activities." },
  { name: "Singapore Maritime Academy Club", category: "constituent", img: "assets/images/CCA/Constituent/sma.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/constituent-clubs/singapore-maritime-academy-club", instagram: "smaclub", desc: "Represents SMA students and organises school-wide events and activities." },
  { name: "Singapore Polytechnic Students' Union", category: "constituent", img: "assets/images/CCA/Constituent/spsu.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/constituent-clubs/singapore-polytechnic-students-union", instagram: "spstudentsunion", desc: "Champions student interests and represents the student body at large." },
  { name: "Community Service & Cultural Club", category: "constituent", img: "assets/images/CCA/Constituent/csc.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/constituent-clubs/community-service-cultural-club", instagram: "spcscc", desc: "Champions community service and cultural initiatives across campus." },
  { name: "SP Students Sports Club", category: "constituent", img: "assets/images/CCA/Constituent/spss.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/constituent-clubs/sp-students-sports-club", instagram: "sp.sportsclub", desc: "Oversees student sports activities and inter-school competitions." },

  // Arts & Culture
  { name: "SP Chinese Music & Cultural Club", category: "arts", img: "assets/images/CCA/Arts/cmc.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-chinese-music-cultural-club", instagram: "spcmcc", desc: "Explore Chinese music and cultural traditions with fellow enthusiasts." },
  { name: "SP Chinese Orchestra", category: "arts", img: "assets/images/CCA/Arts/co.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-chinese-orchestra", instagram: "spcotv", desc: "Perform traditional Chinese instrumental music as an ensemble." },
  { name: "SP Comperes", category: "arts", img: "assets/images/CCA/Arts/sp-comperes.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-comperes", instagram: "spcomperes", desc: "Sharpen your hosting and public speaking skills for campus events." },
  { name: "SP Dance Sport", category: "arts", img: "assets/images/CCA/Arts/dance.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-dance-sport", instagram: "dancesport.sp", desc: "Learn ballroom and Latin dance styles, from social to competitive level." },
  { name: "SP Deejays", category: "arts", img: "assets/images/CCA/Arts/deejays.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-deejays", instagram: "spdeejays", desc: "Learn the craft of DJing and music mixing." },
  { name: "SP Garage Band", category: "arts", img: "assets/images/CCA/Arts/band.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-garage-band", instagram: "spgarageband", desc: "Jam and perform as a band across genres and campus events." },
  { name: "SP Guitarists", category: "arts", img: "assets/images/CCA/Arts/guitarists.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-guitarists", instagram: "spguitarists", desc: "Build your guitar skills, solo or as part of an ensemble." },
  { name: "SP Indian Cultural Society", category: "arts", img: "assets/images/CCA/Arts/ic.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-indian-cultural-society", instagram: "", desc: "Celebrate Indian arts, dance and culture through performance." },
  { name: "SP Japanese Cultural Club", category: "arts", img: "assets/images/CCA/Arts/jc.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-japanese-cultural-club", instagram: "", desc: "Explore Japanese language, arts and pop culture." },
  { name: "SP Life Arts", category: "arts", img: "assets/images/CCA/Arts/la.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-life-arts", instagram: "splifearts", desc: "Express yourself through visual and lifestyle art forms." },
  { name: "SP Lion Dance", category: "arts", img: "assets/images/CCA/Arts/ld.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-lion-dance", instagram: "", desc: "Train in the traditional art of lion dance performance." },
  { name: "SP Malay Language Society", category: "arts", img: "assets/images/CCA/Arts/mls.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-malay-language-society", instagram: "", desc: "Celebrate Malay language, arts and culture." },
  { name: "SP Piano Ensemble", category: "arts", img: "assets/images/CCA/Arts/pe.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-piano-ensemble", instagram: "", desc: "Perform piano repertoire solo and as an ensemble." },
  { name: "SP Stage Management", category: "arts", img: "assets/images/CCA/Arts/sm.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-stage-management-club", instagram: "", desc: "Learn the technical and production side of live performances." },
  { name: "SP Strictly Dance Zone", category: "arts", img: "assets/images/CCA/Arts/sdz.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-strictly-dance-zone", instagram: "", desc: "Train in contemporary and street dance styles." },
  { name: "SP String Ensemble", category: "arts", img: "assets/images/CCA/Arts/se.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-string-ensemble", instagram: "spstrings", desc: "Perform string instrument repertoire as an ensemble." },
  { name: "SP Symphonic Band", category: "arts", img: "assets/images/CCA/Arts/sb.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-symphonic-band", instagram: "spsymphonicband", desc: "Perform wind and percussion repertoire as a concert band." },
  { name: "SP Theatre Compass", category: "arts", img: "assets/images/CCA/Arts/tc.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-theatre-compass", instagram: "", desc: "Explore acting, directing and theatre production." },
  { name: "SP Vocal Talent", category: "arts", img: "assets/images/CCA/Arts/vocal.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/arts-culture/sp-vocal-talents", instagram: "", desc: "Develop your singing voice, solo or in a vocal group." },

  // Service-Learning
  { name: "SP Environment Club", category: "service", img: "assets/images/CCA/Service-Learning/env.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/service-learning/sp-environment-club", instagram: "", desc: "Champion sustainability and environmental causes on campus." },
  { name: "SP Heartware I-DARE Club", category: "service", img: "assets/images/CCA/Service-Learning/sp-heartware-i-dare-club.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/service-learning/sp-heartware-i-dare-club", instagram: "", desc: "Support persons with disabilities through inclusive service projects." },
  { name: "SP Leo Club", category: "service", img: "assets/images/CCA/Service-Learning/sp-leo-club.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/service-learning/sp-leo-club", instagram: "", desc: "Give back to the community through youth-led service projects." },
  { name: "SP Mentoring Club", category: "service", img: "assets/images/CCA/Service-Learning/sp-mentoring-club.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/service-learning/sp-mentoring-club", instagram: "spmentoring", desc: "Mentor younger students and give back through guidance programmes." },
  { name: "SP Primers", category: "service", img: "assets/images/CCA/Service-Learning/sp-primers.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/service-learning/sp-primers", instagram: "", desc: "Support outreach and mentoring programmes for the community." },
  { name: "SP Red Cross", category: "service", img: "assets/images/CCA/Service-Learning/sp-red-cross.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/service-learning/sp-red-cross", instagram: "", desc: "Support humanitarian causes and first-aid outreach initiatives." },
  { name: "SP Rotaract", category: "service", img: "assets/images/CCA/Service-Learning/sp-rotaract.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/service-learning/sp-rotaract-club", instagram: "", desc: "Develop leadership skills while serving the local community." },
  { name: "SP Sign Language Club", category: "service", img: "assets/images/CCA/Service-Learning/sp-sign-language-club.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/service-learning/sp-sign-language-club", instagram: "", desc: "Learn sign language and support the Deaf community." },
  { name: "SP Welfare Service Club", category: "service", img: "assets/images/CCA/Service-Learning/sp-welfare-service-club.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/service-learning/sp-welfare-services-club", instagram: "", desc: "Support welfare initiatives for underserved communities." },

  // Special Interests
  { name: "SP Ambassadors", category: "special", img: "assets/images/CCA/Special/sp-ambassadors.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-ambassadors", instagram: "sp_ambassadors", desc: "Represent SP at events and welcome visitors to the campus." },
  { name: "SP Astronomers", category: "special", img: "assets/images/CCA/Special/sp-astronomers.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-astronomers", instagram: "", desc: "Explore astronomy and stargazing with fellow enthusiasts." },
  { name: "SP Aviation Club", category: "special", img: "assets/images/CCA/Special/sp-aviation-club.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-aviation-club", instagram: "", desc: "Discover the world of aviation and flight." },
  { name: "SP Cru", category: "special", img: "assets/images/CCA/Special/sp-cru.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-cru", instagram: "", desc: "A community for fellowship and faith-based discussion." },
  { name: "SP Catholic Students' Society", category: "special", img: "assets/images/CCA/Special/sp-catholic-students-society.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-catholic-students-society", instagram: "spcatholics", desc: "A community for Catholic students to grow in faith and fellowship." },
  { name: "SP Christian Fellowship", category: "special", img: "assets/images/CCA/Special/sp-christian-fellowship.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-christian-fellowship", instagram: "", desc: "A community for Christian students to grow in faith and fellowship." },
  { name: "SP Debate", category: "special", img: "assets/images/CCA/Special/sp-debate.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-debate", instagram: "", desc: "Sharpen your argumentation and public speaking through debate." },
  { name: "SP Entrepreneurs Club", category: "special", img: "assets/images/CCA/Special/sp-entrepreneurs-club.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-entrepreneurs-club", instagram: "", desc: "Build entrepreneurial skills and explore startup ideas." },
  { name: "SP Infocomm Club", category: "special", soc: true, img: "assets/images/CCA/Special/sp-infocomm-club.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-infocomm-club", instagram: "", desc: "Explore infocomm technology projects and interest groups." },
  { name: "SP International Students' Club", category: "special", img: "assets/images/CCA/Special/sp-international-students-club.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-international-students-club", instagram: "thespisc", desc: "A community connecting international students on campus." },
  { name: "SP Mind Sports", category: "special", img: "assets/images/CCA/Special/sp-mind-sports.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-mind-sports", instagram: "", desc: "Compete in strategy games such as chess and go." },
  { name: "SP Memory Sports Club", category: "special", img: "assets/images/CCA/Special/sp-memory-sports-club.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-memory-sports-club", instagram: "", desc: "Train memory techniques and compete in memory sports." },
  { name: "SP Navigators", category: "special", img: "assets/images/CCA/Special/sp-navigators.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-navigators", instagram: "", desc: "A community for fellowship, discipleship and outreach." },
  { name: "SP Robotics, Innovation, Technology & Enterprise", category: "special", soc: true, img: "assets/images/CCA/Special/sp-robotics-innovation-technology-and-enterprise.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-robotics-innovation-technology-enterprise", instagram: "", desc: "Build robotics and tech projects with like-minded innovators." },
  { name: "SP Student Exchange Club", category: "special", img: "assets/images/CCA/Special/sp-student-exchange-club.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-student-exchange-club", instagram: "sp.sec", desc: "Support incoming and outgoing student exchange experiences." },
  { name: "SP Visual Media", category: "special", img: "assets/images/CCA/Special/sp-visual-media.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/special-interests/sp-visualmedia", instagram: "", desc: "Create photography, videography and visual media content." },

  // Sports & Adventure
  { name: "SP Adventurers", category: "sports", img: "assets/images/CCA/Sports/sp-adventurers.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-adventurers", instagram: "spadventurers", desc: "Take on outdoor adventure activities and expeditions." },
  { name: "SP Aikido", category: "sports", img: "assets/images/CCA/Sports/sp-aikido.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-aikido", instagram: "", desc: "Train in the Japanese martial art of Aikido." },
  { name: "SP Archery", category: "sports", img: "assets/images/CCA/Sports/sp-archery.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-archery", instagram: "", desc: "Develop precision and focus through competitive archery." },
  { name: "SP Badminton", category: "sports", img: "assets/images/CCA/Sports/sp-badminton.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-badminton", instagram: "", desc: "Train and compete in badminton at every skill level." },
  { name: "SP Basketball", category: "sports", img: "assets/images/CCA/Sports/sp-basketball.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-basketball", instagram: "", desc: "Train and compete in basketball at every skill level." },
  { name: "SP Bowling", category: "sports", img: "assets/images/CCA/Sports/sp-bowling.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-bowling", instagram: "", desc: "Train and compete in tenpin bowling." },
  { name: "SP Canoe Polo", category: "sports", waterSport: true, img: "assets/images/CCA/Sports/sp-canoe-polo.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-canoe-polo", instagram: "", desc: "Train and compete in the water sport of canoe polo." },
  { name: "SP Canoe Sprint", category: "sports", waterSport: true, img: "assets/images/CCA/Sports/sp-canoe-sprint.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-canoe-sprint", instagram: "", desc: "Train and compete in flatwater canoe sprint racing." },
  { name: "SP Cyclists", category: "sports", img: "assets/images/CCA/Sports/sp-cyclists.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-cyclists", instagram: "", desc: "Ride and train together as a competitive cycling team." },
  { name: "SP Darts", category: "sports", img: "assets/images/CCA/Sports/sp-darts.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-darts", instagram: "", desc: "Sharpen your precision in competitive darts." },
  { name: "SP Dragon Boat", category: "sports", waterSport: true, img: "assets/images/CCA/Sports/sp-dragon-boat.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-dragon-boat", instagram: "", desc: "Train and compete in the water sport of dragon boat racing." },
  { name: "SP Fencing", category: "sports", img: "assets/images/CCA/Sports/sp-fencing.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-fencing", instagram: "", desc: "Train and compete in the sport of fencing." },
  { name: "SP Floorball", category: "sports", img: "assets/images/CCA/Sports/sp-floorball.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-floorball", instagram: "spfloorball", desc: "Train and compete in fast-paced floorball matches." },
  { name: "SP Handball", category: "sports", img: "assets/images/CCA/Sports/sp-handball.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-handball", instagram: "", desc: "Train and compete in team handball." },
  { name: "SP Hockey", category: "sports", img: "assets/images/CCA/Sports/sp-hockey.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-hockey", instagram: "", desc: "Train and compete in field hockey." },
  { name: "SP Karate", category: "sports", img: "assets/images/CCA/Sports/sp-karate.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-karate", instagram: "", desc: "Train in the Japanese martial art of Karate." },
  { name: "SP Kenjutsu", category: "sports", img: "assets/images/CCA/Sports/sp-kenjutsu.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-kenjutsu", instagram: "", desc: "Train in the Japanese swordsmanship art of Kenjutsu." },
  { name: "SP Lifesavers", category: "sports", waterSport: true, img: "assets/images/CCA/Sports/sp-lifesavers.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-lifesavers", instagram: "", desc: "Train in the water sport and skill of lifesaving." },
  { name: "SP Mixed Martial Arts", category: "sports", img: "assets/images/CCA/Sports/sp-mixed-martial-arts.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-mixed-martial-arts", instagram: "", desc: "Cross-train across striking and grappling martial arts." },
  { name: "SP Muay Thai", category: "sports", img: "assets/images/CCA/Sports/sp-muay-thai.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-muay-thai", instagram: "", desc: "Train in the striking martial art of Muay Thai." },
  { name: "SP Netball", category: "sports", img: "assets/images/CCA/Sports/sp-netball.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-netball", instagram: "", desc: "Train and compete in competitive netball." },
  { name: "SP Pool", category: "sports", img: "assets/images/CCA/Sports/sp-pool.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-pool", instagram: "", desc: "Sharpen your cue skills in competitive pool." },
  { name: "SP Rock Climbers", category: "sports", img: "assets/images/CCA/Sports/sp-rock-climbers.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-rock-climbers", instagram: "", desc: "Build strength and technique in indoor rock climbing." },
  { name: "SP Rugby", category: "sports", img: "assets/images/CCA/Sports/sp-rugby.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-rugby", instagram: "", desc: "Train and compete in contact rugby." },
  { name: "SP Shooting", category: "sports", img: "assets/images/CCA/Sports/sp-shooting.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-shooting", instagram: "", desc: "Develop precision in competitive target shooting." },
  { name: "SP Silat", category: "sports", img: "assets/images/CCA/Sports/sp-silat.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-silat", instagram: "", desc: "Train in the traditional martial art of Silat." },
  { name: "SP Skate Club", category: "sports", img: "assets/images/CCA/Sports/sp-skate-club.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-skates", instagram: "", desc: "Build tricks and technique in skateboarding." },
  { name: "SP Soccer", category: "sports", img: "assets/images/CCA/Sports/sp-soccer.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-soccer", instagram: "", desc: "Train and compete in competitive football." },
  { name: "SP Softball", category: "sports", img: "assets/images/CCA/Sports/sp-softball.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-softball", instagram: "", desc: "Train and compete in competitive softball." },
  { name: "SP Squash", category: "sports", img: "assets/images/CCA/Sports/sp-squash.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-squash", instagram: "", desc: "Train and compete in competitive squash." },
  { name: "SP Strength Athletics", category: "sports", img: "assets/images/CCA/Sports/sp-strength-athletics.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-strength-athletics", instagram: "", desc: "Build strength through competitive weightlifting disciplines." },
  { name: "SP Swimming", category: "sports", waterSport: true, img: "assets/images/CCA/Sports/sp-swimming.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-swimming", instagram: "", desc: "Train and compete in the water sport of swimming." },
  { name: "SP Table Tennis", category: "sports", img: "assets/images/CCA/Sports/sp-table-tennis.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-table-tennis", instagram: "", desc: "Train and compete in competitive table tennis." },
  { name: "SP Taekwondo", category: "sports", img: "assets/images/CCA/Sports/sp-taekwondo.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-taekwondo", instagram: "", desc: "Train in the Korean martial art of Taekwondo." },
  { name: "SP Tchoukball", category: "sports", img: "assets/images/CCA/Sports/sp-tchoukball.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-tchoukball", instagram: "", desc: "Train and compete in the fast-paced sport of tchoukball." },
  { name: "SP Tennis", category: "sports", img: "assets/images/CCA/Sports/sp-tennis.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-tennis", instagram: "", desc: "Train and compete in competitive tennis." },
  { name: "SP Touch Football", category: "sports", img: "assets/images/CCA/Sports/sp-touch-football.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-touch-football", instagram: "", desc: "Train and compete in non-contact touch football." },
  { name: "SP Track & Field", category: "sports", img: "assets/images/CCA/Sports/sp-track-and-field.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-track-field", instagram: "", desc: "Train and compete across track and field events." },
  { name: "SP Ultimate Frisbee", category: "sports", img: "assets/images/CCA/Sports/sp-ultimate-frisbee.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-ultimate-(frisbee)", instagram: "", desc: "Train and compete in the sport of ultimate frisbee." },
  { name: "SP Volleyball", category: "sports", img: "assets/images/CCA/Sports/sp-volleyball.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-volleyball", instagram: "", desc: "Train and compete in competitive volleyball." },
  { name: "SP Wushu & Sanda", category: "sports", img: "assets/images/CCA/Sports/sp-wushu-and-sanda.jpg", url: "https://www.sp.edu.sg/student-life/ccas/our-clubs/sports-adventure/sp-wushu-sanda", instagram: "", desc: "Train in the Chinese martial arts of Wushu and Sanda." },];

const CATEGORY_LABELS = {
  constituent: "Constituent Club",
  arts: "Arts & Culture",
  service: "Service-Learning",
  special: "Special Interest",
  sports: "Sports & Adventure",
};

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("ccaGrid");
  const searchInput = document.getElementById("ccaSearch");
  const searchLabel = document.getElementById("ccaSearchLabel");
  const emptyState = document.getElementById("ccaEmptyState");
  const resultCount = document.getElementById("ccaResultCount");
  const filterInputs = Array.from(document.querySelectorAll(".cca-filter"));

  if (!grid) return;

  function activeFilters() {
    return filterInputs.filter((el) => el.checked).map((el) => el.dataset.filter);
  }

  function matchesFilters(cca, filters) {
    if (filters.length === 0) return true;
    return filters.some((f) => {
      if (f === "soc") return !!cca.soc;
      if (f === "watersport") return !!cca.waterSport;
      return cca.category === f;
    });
  }

  function contactIcons(cca) {
    const icons = [];
    if (cca.instagram) {
      icons.push(`
        <a
          class="cca-contact-icon"
          href="https://instagram.com/${cca.instagram}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="${cca.name} on Instagram"
          title="@${cca.instagram}"
        >
          <i class="bi bi-instagram" aria-hidden="true"></i>
        </a>`);
    }
    return icons.join("");
  }

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    const filters = activeFilters();

    const results = CCA_DATA.filter((cca) => {
      const matchesQuery = !query || cca.name.toLowerCase().includes(query);
      return matchesQuery && matchesFilters(cca, filters);
    });

    searchLabel.textContent = query ? `"${searchInput.value.trim()}"` : "all CCAs";
    resultCount.textContent = `${results.length} CCA${results.length === 1 ? "" : "s"} found`;
    emptyState.classList.toggle("d-none", results.length !== 0);

    grid.innerHTML = results
      .map(
        (cca) => `
        <div class="col-12 col-sm-6 col-lg-4">
          <article class="cca-card h-100">
            <div class="cca-card-media">
              <img
                src="${cca.img}"
                alt="${cca.name}"
                loading="lazy"
                onerror="this.closest('.cca-card-media').classList.add('cca-media-fallback')"
              />
              <div class="cca-card-media-fallback">
                <i class="bi bi-image" aria-hidden="true"></i>
                <span>Img of CCA</span>
              </div>
            </div>
            <div class="cca-card-body">
              <span class="cca-card-tag">${CATEGORY_LABELS[cca.category]}</span>
              <h3 class="cca-card-title">${cca.name}</h3>
              <p class="cca-card-desc">${cca.desc}</p>
            </div>
            <div class="cca-card-footer">
              <div class="cca-contact-icons">${contactIcons(cca)}</div>
              <a
                class="cca-card-signup"
                href="${cca.url}"
                target="_blank"
                rel="noopener noreferrer"
              >
                Website <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
              </a>
            </div>
          </article>
        </div>`
      )
      .join("");
  }

  searchInput.addEventListener("input", render);
  filterInputs.forEach((el) => el.addEventListener("change", render));

  render();
});