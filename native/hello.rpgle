     D person          ds                  qualified
     D  fname                        16a   inz('Aaron')
     D  lname                        16a   inz('Magid')
     D  age                           3i 0 inz(23)
     D otherPerson     ds                  likeds(person)
     D                                     inz(*likeds)
      /free
           otherPerson.fname = 'Beth';
           otherPerson.age = 25;

           dsply (%trim(person.fname)
               + ' '
               + %trim(person.lname)
               + ' is '
               + %char(person.age));
           dsply (%trim(otherPerson.fname)
               + ' '
               + %trim(otherPerson.lname)
               + ' is '
               + %char(otherPerson.age));
           return;