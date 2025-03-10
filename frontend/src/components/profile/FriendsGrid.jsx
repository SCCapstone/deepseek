function FriendCard({ friend }) {
    return (
        <div>
            @{friend.username}
        </div>
    );
}

export default function FriendsGrid({ friends }) {
    return (
        <div
            className='p-1'
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                gap: 12,
            }}
        >
            {friends.map((friend, i) => <FriendCard key={i} friend={friend}/>)}
        </div>
    );
}