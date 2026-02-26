function fakeDocumentReader(config, streamHelper, journal) {
    var count = parseInt(getConfigValue(config, 'count', '16')) || 16;
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

    return {
        open: function() {
            documents = [];
            currentIndex = 0;

            for (var i = 0; i < count; i++) {
                var firstName = randomElement(firstNames);
                var lastName = randomElement(lastNames);

                documents.push({
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
                });

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
