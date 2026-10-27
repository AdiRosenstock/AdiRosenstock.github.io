"""Deterministic Malthusian model; t = 0 is the intervention."""
import math


def simulate(tau_before, tau_after, A_jump, tech_growth,
             alpha, gamma, rho, H, generations):
    """Start at equilibrium, then follow households across generations."""
    _validate_parameters(locals())

    # Before the change: one surviving child per worker.
    L0 = H * ((1 - tau_before) * gamma / rho) ** (1 / (1 - alpha))
    w0 = rho / gamma
    c0 = (1 - gamma) * w0
    Y0 = L0 * w0 / (1 - tau_before)
    L = L0
    history = []

    for t in range(generations + 1):
        A = A_jump * (1 + tech_growth) ** t
        Y = A * L ** alpha * H ** (1 - alpha)
        w = (1 - tau_after) * Y / L
        c = (1 - gamma) * w
        n = gamma * w / rho
        history.append(dict(
            t=t, population=L, output=Y, income=w,
            consumption=c, children=n,
            consumptionRatio=c / c0,
            populationRatio=L / L0,
            outputRatio=Y / Y0,
        ))
        L = n * L

    # With continual innovation, population never settles at a fixed level.
    w_star = w0 * (1 + tech_growth) ** (1 / (1 - alpha))
    L_star = (H * (A_jump * (1 - tau_after) * gamma / rho)
              ** (1 / (1 - alpha))) if tech_growth == 0 else None
    return dict(
        history=history, initialPopulation=L0,
        initialIncome=w0, initialConsumption=c0,
        longRunIncome=w_star, longRunConsumption=(1 - gamma) * w_star,
        longRunPopulation=L_star,
    )


def _validate_parameters(values):
    bounds = {
        "tau_before": (0, 0.75), "tau_after": (0, 0.75),
        "A_jump": (1, 3), "tech_growth": (0, 0.04),
        "alpha": (0.3, 0.85), "gamma": (0.1, 0.5),
        "rho": (0.1, 0.6), "H": (1_000, 1_000_000),
        "generations": (10, 120),
    }
    for name, (low, high) in bounds.items():
        value = values[name]
        if (isinstance(value, bool) or not isinstance(value, (int, float))
                or not math.isfinite(value) or not low <= value <= high):
            raise ValueError(f"{name} must be a number between {low} and {high}.")
    if not isinstance(values["generations"], int):
        raise ValueError("generations must be a whole number.")
