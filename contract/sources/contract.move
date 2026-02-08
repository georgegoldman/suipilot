module contract::contract;

public fun new(ctx: &mut TxContext): deepbook::BalanceManager {
    let id = object::new(ctx);
    event::emit(deepbook::BalanceManagerEvent {
        balance_manager_id: id.to_inner(),
        owner: ctx.sender(),
    });

    deepbook::BalanceManager {
        id,
        owner: ctx.sender(),
        balance: bag::new(ctx),
        allow_listed: vec_set::empty(ctx)
    }
}
