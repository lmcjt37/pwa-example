(function (window) {
    'use strict';

    var fabPushElement = document.querySelector('.fab__push');
    var fabPushImgElement = document.querySelector('.fab__image');

    function saveSubscriptionID(subscription) {
        var subscription_id = subscription.endpoint.split('gcm/send/')[1];

        console.log("Subscription ID", subscription_id);

        fetch('http://localhost:3333/api/users', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id : subscription_id
            })
        });
    }

    function deleteSubscriptionID(subscription) {
        var subscription_id = subscription.endpoint.split('gcm/send/')[1];

        fetch('http://localhost:3333/api/user/' + subscription_id, {
            method: 'delete',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    function isPushSupported() {
        if (Notification.permission === 'denied') {
            alert('User has blocked push notification.');
            return;
        }

        if (!('PushManager' in window)) {
            alert('Sorry, Push notification isn\'t supported in your browser.');
            return;
        }

        navigator.serviceWorker.ready.then(function(registration) {
            registration.pushManager.getSubscription()
            .then(function (subscription) {
                if (subscription) {
                    changePushStatus(true);
                } else {
                    changePushStatus(false);
                }
            })
            .catch(function (error) {
                console.error('Error occurred while enabling push ', error);
            });
        });
    }

    // Ask user permission
    function subscribePush() {
        navigator.serviceWorker.ready.then(function(registration) {
            if (!registration.pushManager) {
                alert('Your browser doesn\'t support push notification.');
                return false;
            }

            registration.pushManager.subscribe({
                userVisibleOnly: true //Always show notification when received
            })
            .then(function (subscription) {
                toast('Subscribed successfully.');
                console.log(subscription);
                saveSubscriptionID(subscription);
                changePushStatus(true);
            })
            .catch(function (error) {
                changePushStatus(false);
                console.error('Push notification subscription error: ', error);
            });
        });
    }

    function unsubscribePush() {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.pushManager.getSubscription()
            .then(function (subscription) {
                if(!subscription) {
                    alert('Unable to unregister push notification.');
                    return;
                }

                subscription.unsubscribe()
                    .then(function () {
                        toast('Unsubscribed successfully.');
                        console.log(subscription);
                        deleteSubscriptionID(subscription);
                        changePushStatus(false);
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            })
            .catch(function (error) {
                console.error('Failed to unsubscribe push notification.');
            });
        });
    }

    function changePushStatus(status) {
        fabPushElement.dataset.checked = status;
        fabPushElement.checked = status;
        if (status) {
            fabPushElement.classList.add('active');
            fabPushImgElement.src = '../images/push-on.png';
        } else {
            fabPushElement.classList.remove('active');
            fabPushImgElement.src = '../images/push-off.png';
        }
    }

    fabPushElement.addEventListener('click', function () {
        var isSubscribed = (fabPushElement.dataset.checked === 'true');
        if (isSubscribed) {
            unsubscribePush();
        } else {
            subscribePush();
        }
    });

    isPushSupported();
})(window);
