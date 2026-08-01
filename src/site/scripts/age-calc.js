  /* Dynamically calculate her age instead of hardcoding it.
     Editable: change BIRTH_YEAR / RELATIONSHIP_YEARS below if needed — birthday is fixed at Aug 22 per the spec. */
  (function(){
    var BIRTH_YEAR = 2006;
    var BIRTH_MONTH = 8;  // August
    var BIRTH_DAY = 22;
    var RELATIONSHIP_YEARS = 4; // update this each year on the relationship anniversary
    var today = new Date();
    var age = today.getFullYear() - BIRTH_YEAR;
    var hasHadBirthdayThisYear =
      (today.getMonth() + 1 > BIRTH_MONTH) ||
      (today.getMonth() + 1 === BIRTH_MONTH && today.getDate() >= BIRTH_DAY);
    if (!hasHadBirthdayThisYear) age -= 1;
    var ageTag = document.getElementById('age-tag');
    if (ageTag) ageTag.textContent = age + ' Years Of You';
    var ageHeroNumber = document.getElementById('age-hero-number');
    if (ageHeroNumber) ageHeroNumber.textContent = age + ' Years of You & ' + RELATIONSHIP_YEARS + ' Years Together';
  })();
