function fakeDocumentReader(config, streamHelper, journal) {
    var count = parseInt(getConfigValue(config, 'count', '33')) || 33;
    var requiredField = getConfigValue(config, 'requiredField', '');
    var documents = [];
    var currentIndex = 0;

    var firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward',
        'Fiona', 'George', 'Hannah', 'Ivan', 'Julia',
        'Kevin', 'Laura', 'Michael', 'Nina', 'Oscar'];

    var lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
        'Garcia', 'Miller', 'Davis', 'Wilson', 'Taylor',
        'Anderson', 'Thomas', 'Jackson', 'White', 'Harris'];

    var cities = ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt',
        'Stuttgart', 'Duesseldorf', 'Leipzig', 'Dortmund', 'Essen',
        'Bremen', 'Dresden', 'Hanover', 'Nuremberg', 'Bochum'];

    var categories = ['electronics', 'clothing', 'food', 'furniture', 'sports',
        'books', 'toys', 'beauty', 'tools', 'garden'];

    var statuses = ['active', 'inactive', 'pending', 'archived'];

    var departments = ['Engineering', 'Marketing', 'Sales', 'Finance',
        'HR', 'Operations', 'Legal', 'Support'];

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomElement(arr) {
        return arr[randomInt(0, arr.length - 1)];
    }

    function randomPrice() {
        return Math.round(Math.random() * 9900 + 100) / 100;
    }

    function pad(n, width) {
        var s = String(n);
        while (s.length < width) {
            s = '0' + s;
        }
        return s;
    }

    function randomSuffix() {
        var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
        var result = '';
        for (var i = 0; i < 6; i++) {
            result += chars.charAt(randomInt(0, chars.length - 1));
        }
        return result;
    }

    function generateId(index) {
        return 'doc-' + pad(index + 1, 5) + '-' + randomSuffix();
    }

    function randomDate() {
        var year = 2024;
        var month = pad(randomInt(1, 12), 2);
        var day = pad(randomInt(1, 28), 2);
        return year + '-' + month + '-' + day;
    }

    // Standard field names that are always generated
    var standardFields = [
        'id', 'firstName', 'lastName', 'email', 'city', 'age',
        'category', 'status', 'department', 'price', 'quantity',
        'score', 'createdAt'
    ];

    function generateFakeValue(fieldName) {
        // Produce a plausible fake value based on the field name
        var lower = fieldName.toLowerCase();
        if (lower.indexOf('date') >= 0 || lower.indexOf('at') >= 0 || lower.indexOf('time') >= 0) {
            return randomDate();
        }
        if (lower.indexOf('price') >= 0 || lower.indexOf('cost') >= 0 || lower.indexOf('amount') >= 0) {
            return randomPrice();
        }
        if (lower.indexOf('count') >= 0 || lower.indexOf('qty') >= 0 || lower.indexOf('quantity') >= 0 || lower.indexOf('num') >= 0) {
            return randomInt(1, 100);
        }
        if (lower.indexOf('score') >= 0 || lower.indexOf('rating') >= 0 || lower.indexOf('rank') >= 0) {
            return randomInt(0, 100);
        }
        if (lower.indexOf('age') >= 0) {
            return randomInt(18, 75);
        }
        if (lower.indexOf('city') >= 0 || lower.indexOf('location') >= 0) {
            return randomElement(cities);
        }
        if (lower.indexOf('category') >= 0 || lower.indexOf('type') >= 0) {
            return randomElement(categories);
        }
        if (lower.indexOf('status') >= 0 || lower.indexOf('state') >= 0) {
            return randomElement(statuses);
        }
        if (lower.indexOf('department') >= 0 || lower.indexOf('dept') >= 0 || lower.indexOf('team') >= 0) {
            return randomElement(departments);
        }
        if (lower.indexOf('email') >= 0 || lower.indexOf('mail') >= 0) {
            var fn = randomElement(firstNames).toLowerCase();
            var ln = randomElement(lastNames).toLowerCase();
            return fn + '.' + ln + '@example.com';
        }
        if (lower.indexOf('name') >= 0) {
            return randomElement(firstNames) + ' ' + randomElement(lastNames);
        }
        if (lower.indexOf('id') >= 0) {
            return 'id-' + randomSuffix();
        }
        // Default: a generic fake string value
        return fieldName + '-' + randomSuffix();
    }

    return {
        open: function() {
            documents = [];
            currentIndex = 0;

            for (var i = 0; i < count; i++) {
                var firstName = randomElement(firstNames);
                var lastName = randomElement(lastNames);

                var doc = {
                    id: generateId(i),
                    firstName: firstName,
                    lastName: lastName,
                    email: firstName.toLowerCase() + '.' + lastName.toLowerCase() + '@example.com',
                    city: randomElement(cities),
                    age: randomInt(18, 75),
                    category: randomElement(categories),
                    status: randomElement(statuses),
                    department: randomElement(departments),
                    price: randomPrice(),
                    quantity: randomInt(1, 100),
                    score: randomInt(0, 100),
                    createdAt: randomDate()
                };

                // Always include the user-specified required field
                if (requiredField && standardFields.indexOf(requiredField) < 0) {
                    doc[requiredField] = generateFakeValue(requiredField);
                }

                documents.push(doc);
                journal.onProgress(i + 1);
            }
        },

        readRecords: function*() {
            while (currentIndex < documents.length) {
                yield documents[currentIndex++];
            }
        },

        close: function() {
            documents = [];
            currentIndex = 0;
        }
    };
}

module.exports = fakeDocumentReader;
